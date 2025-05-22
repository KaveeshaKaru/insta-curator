// lib/scheduler.ts
import cron from "node-cron";
import prisma from "@/lib/prisma";
import axios from "axios";

interface InstagramMediaResponse {
  id: string;
}

interface PostWithRelations {
  id: number;
  userId: string;
  scheduledAt: Date;
  status: string;
  isCarousel: boolean;
  user: {
    instagramBusinessAccountId: string | null;
    instagramPageAccessToken: string | null;
  };
  post_photo: Array<{
    order: number;
    photo: {
      id: number;
      url: string;
      caption: string | null;
    };
  }>;
}

class Scheduler {
  private static instance: Scheduler;
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning: boolean = false;
  private isProcessing: boolean = false;
  private processingPosts: Set<number> = new Set();
  private lockId: string = "scheduler-lock";
  private lockTimeout: number = 60000; // 1 minute

  private constructor() {}

  public static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  public getStatus(): boolean {
    return this.isRunning;
  }

  private async acquireLock(): Promise<boolean> {
    try {
      const now = new Date();
      
      // Try to get existing lock
      const existingLock = await prisma.lock.findUnique({
        where: { id: this.lockId }
      });

      if (existingLock) {
        // If lock exists and is not expired, return false
        if (existingLock.expiresAt > now) {
          return false;
        }
        // If lock is expired, delete it
        await prisma.lock.delete({
          where: { id: this.lockId }
        });
      }

      // Create new lock
      await prisma.lock.create({
        data: {
          id: this.lockId,
          lockedAt: now,
          expiresAt: new Date(now.getTime() + this.lockTimeout)
        }
      });

      return true;
    } catch (error) {
      console.error("Error acquiring lock:", error);
      return false;
    }
  }

  private async releaseLock(): Promise<void> {
    try {
      await prisma.lock.delete({
        where: { id: this.lockId }
      });
    } catch (error) {
      console.error("Error releasing lock:", error);
    }
  }

  private async refreshLock(): Promise<void> {
    try {
      const now = new Date();
      await prisma.lock.update({
        where: { id: this.lockId },
        data: {
          expiresAt: new Date(now.getTime() + this.lockTimeout)
        }
      });
    } catch (error) {
      console.error("Error refreshing lock:", error);
      // If we can't refresh the lock, stop the scheduler
      await this.stop();
    }
  }

  public async start() {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    try {
      // Try to acquire lock
      const hasLock = await this.acquireLock();
      if (!hasLock) {
        console.log("Could not acquire lock - another instance is running");
        return;
      }

      console.log("Starting scheduler at", new Date().toISOString());
      
      // Clear any existing cron job
      if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob = null;
      }

      this.cronJob = cron.schedule("* * * * *", async () => {
        // Refresh lock
        await this.refreshLock();

        // Prevent concurrent processing
        if (this.isProcessing) {
          console.log("Skipping this run - previous run still in progress");
          return;
        }

        try {
          this.isProcessing = true;
          const now = new Date(new Date().toUTCString()); // Ensure UTC
          console.log("Scheduler running at", now.toISOString());
          
          // Find posts that are due using raw SQL
          const posts = await prisma.$queryRaw<PostWithRelations[]>`
            SELECT 
              p.*,
              json_build_object(
                'instagramBusinessAccountId', u."instagramBusinessAccountId",
                'instagramPageAccessToken', u."instagramPageAccessToken"
              ) as user,
              COALESCE(
                json_agg(
                  json_build_object(
                    'order', pp."order",
                    'photo', json_build_object(
                      'id', ph.id,
                      'url', ph.url,
                      'caption', ph.caption
                    )
                  ) ORDER BY pp."order"
                ) FILTER (WHERE pp.id IS NOT NULL),
                '[]'
              ) as post_photo
            FROM post p
            JOIN "user" u ON p."userId" = u.id
            LEFT JOIN post_photo pp ON p.id = pp."postId"
            LEFT JOIN photo ph ON pp."photoId" = ph.id
            WHERE p.status = 'pending'
              AND p."scheduledAt" <= ${now}
              AND p.id != ALL(${Array.from(this.processingPosts)})
            GROUP BY p.id, u."instagramBusinessAccountId", u."instagramPageAccessToken"
            ORDER BY p."scheduledAt" ASC
          `;

          console.log(`Found ${posts.length} posts due for processing`);

          for (const post of posts) {
            try {
              // Add post to processing set
              this.processingPosts.add(post.id);

              // Double-check the post status before processing
              const currentPost = await prisma.post.findUnique({
                where: { id: post.id },
                select: { status: true }
              });

              if (!currentPost || currentPost.status !== "pending") {
                console.log(`Post ${post.id} already processed, skipping`);
                this.processingPosts.delete(post.id);
                continue;
              }

              console.log(`Processing post ${post.id} scheduled for ${post.scheduledAt.toISOString()}`);
              
              if (!post.user.instagramBusinessAccountId || !post.user.instagramPageAccessToken) {
                console.error(`Post ${post.id} skipped: Instagram not connected`);
                await prisma.post.update({
                  where: { id: post.id },
                  data: { status: "failed" },
                });
                this.processingPosts.delete(post.id);
                continue;
              }

              // Check for rate limit errors
              try {
                const photos = post.post_photo.sort((a, b) => a.order - b.order);
                if (photos.length === 0) {
                  console.error(`Post ${post.id} skipped: No photos found`);
                  await prisma.post.update({
                    where: { id: post.id },
                    data: { status: "failed" },
                  });
                  this.processingPosts.delete(post.id);
                  continue;
                }

                let creationId;
                if (post.isCarousel && photos.length > 1) {
                  console.log('Starting carousel post process...');
                  
                  // Create axios instance with timeout
                  const axiosInstance = axios.create({
                    timeout: 30000, // 30 seconds
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  // Upload each media item as a carousel item with timeout
                  const mediaIds = [];
                  for (const [index, photo] of photos.entries()) {
                    try {
                      console.log(`Uploading image ${index + 1}/${photos.length}...`);
                      const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
                        `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media`,
                        {
                          image_url: photo.photo.url,
                          is_carousel_item: true,
                          access_token: post.user.instagramPageAccessToken
                        }
                      );
                      mediaIds.push(mediaRes.data.id);
                      console.log(`Successfully uploaded image ${index + 1}, got media ID: ${mediaRes.data.id}`);
                    } catch (error: any) {
                      console.error(`Error uploading image ${index + 1}:`, error.response?.data || error.message);
                      throw new Error(`Failed to upload image ${index + 1}: ${error.response?.data?.error?.message || error.message}`);
                    }
                  }

                  console.log('All images uploaded, creating carousel container...');
                  
                  // Create carousel container
                  const carouselRes = await axiosInstance.post<InstagramMediaResponse>(
                    `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media`,
                    {
                      media_type: "CAROUSEL",
                      children: mediaIds,
                      caption: photos[0].photo.caption || "No caption provided",
                      access_token: post.user.instagramPageAccessToken
                    }
                  ).catch((error) => {
                    console.error('Error creating carousel:', error.response?.data || error.message);
                    throw new Error(`Failed to create carousel: ${error.response?.data?.error?.message || error.message}`);
                  });

                  console.log('Carousel container created, publishing...');
                  creationId = carouselRes.data.id;
                } else {
                  // Single photo post
                  console.log('Starting single image post process...');
                  
                  const mediaRes = await axios.post<InstagramMediaResponse>(
                    `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media`,
                    {
                      image_url: photos[0].photo.url,
                      caption: photos[0].photo.caption || "No caption provided",
                      access_token: post.user.instagramPageAccessToken
                    }
                  ).catch((error) => {
                    console.error('Error creating media:', error.response?.data || error.message);
                    throw new Error(`Failed to create media: ${error.response?.data?.error?.message || error.message}`);
                  });

                  console.log('Image uploaded, publishing...');
                  creationId = mediaRes.data.id;
                }

                console.log(`Post ${post.id} media created with ID: ${creationId}`);

                // Publish media
                const publishRes = await axios.post(
                  `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media_publish`,
                  { 
                    creation_id: creationId,
                    access_token: post.user.instagramPageAccessToken
                  }
                ).catch((error) => {
                  console.error('Error publishing media:', error.response?.data || error.message);
                  throw new Error(`Failed to publish media: ${error.response?.data?.error?.message || error.message}`);
                });

                // Update post status atomically
                await prisma.post.update({
                  where: { id: post.id },
                  data: {
                    status: "posted",
                    postedAt: new Date(),
                    igMediaId: creationId,
                  },
                });

                console.log(`Post ${post.id} published successfully`);
              } catch (error: any) {
                if (error.response?.data?.error?.code === 4) {
                  console.error(`Rate limit reached for post ${post.id}. Will retry later.`);
                  // Don't mark as failed, let it retry
                  continue;
                }
                throw error;
              }
            } catch (error: any) {
              console.error(`Error publishing post ${post.id}:`, error.response?.data || error.message);
              await prisma.post.update({
                where: { id: post.id },
                data: { status: "failed" },
              });
            } finally {
              // Remove post from processing set
              this.processingPosts.delete(post.id);
            }
          }
        } catch (error: any) {
          console.error("Scheduler error:", error.message);
        } finally {
          this.isProcessing = false;
        }
      });
      this.isRunning = true;
      console.log("Scheduler started successfully");
    } catch (error: any) {
      console.error("Failed to start scheduler:", error.message);
      await this.releaseLock();
    }
  }

  public async stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    this.processingPosts.clear();
    await this.releaseLock();
    console.log("Scheduler stopped");
  }
}

// Export a single instance
const scheduler = Scheduler.getInstance();
export { scheduler };