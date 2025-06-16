// lib/scheduler.ts
import cron from "node-cron";
import prisma from "@/lib/prisma";
import axios from "axios";
import { Post, User, PostPhoto, Photo } from "@prisma/client";

interface InstagramMediaResponse {
  id: string;
}

interface PostWithRelations extends Post {
  user: Pick<User, "instagramBusinessAccountId" | "instagramPageAccessToken">;
  photos: (PostPhoto & {
    photo: Photo;
  })[];
}

class Scheduler {
  private static instance: Scheduler;
  private isRunning: boolean = false;
  private isProcessing: boolean = false;
  private processingPosts: Set<number> = new Set();

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

  public async start() {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    try {
      console.log("Starting scheduler at", new Date().toISOString());
      
      try {
        this.isProcessing = true;
        const now = new Date(new Date().toUTCString()); // Ensure UTC
        console.log("Scheduler running at", now.toISOString());
        
        // Find posts that are due using a more efficient query
        const posts = await prisma.post.findMany({
          where: {
            status: 'pending',
            scheduledAt: {
              lte: now
            },
            id: {
              notIn: Array.from(this.processingPosts)
            }
          },
          include: {
            user: {
              select: {
                instagramBusinessAccountId: true,
                instagramPageAccessToken: true
              }
            },
            photos: {
              orderBy: {
                order: 'asc'
              },
              include: {
                photo: true
              }
            }
          },
          orderBy: {
            scheduledAt: 'asc'
          }
        }) as PostWithRelations[];

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
              const photos = post.photos;
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
                for (const photo of photos) {
                  try {
                    console.log(`Uploading image ${photo.order + 1}/${photos.length}...`);
                    const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
                      `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media`,
                      {
                        image_url: photo.photo.url,
                        is_carousel_item: true,
                        access_token: post.user.instagramPageAccessToken
                      }
                    );
                    mediaIds.push(mediaRes.data.id);
                    console.log(`Successfully uploaded image ${photo.order + 1}, got media ID: ${mediaRes.data.id}`);
                  } catch (error: any) {
                    console.error(`Error uploading image ${photo.order + 1}:`, error.response?.data || error.message);
                    throw new Error(`Failed to upload image ${photo.order + 1}: ${error.response?.data?.error?.message || error.message}`);
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

      this.isRunning = true;
      console.log("Scheduler started successfully");
    } catch (error: any) {
      console.error("Failed to start scheduler:", error.message);
    }
  }

  public async stop() {
    this.isRunning = false;
    this.processingPosts.clear();
    console.log("Scheduler stopped");
  }
}

// Export a single instance
const scheduler = Scheduler.getInstance();
export { scheduler };