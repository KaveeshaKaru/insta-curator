// lib/scheduler.ts
import cron from "node-cron";
import prisma from "@/lib/prisma";
import axios from "axios";

class Scheduler {
  private static instance: Scheduler;
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning: boolean = false;

  private constructor() {}

  public static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  public start() {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    try {
      console.log("Starting scheduler at", new Date().toISOString());
      
      // Clear any existing cron job
      if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob = null;
      }

      this.cronJob = cron.schedule("* * * * *", async () => {
        try {
          const now = new Date(new Date().toUTCString()); // Ensure UTC
          console.log("Scheduler running at", now.toISOString());
          
          // Log all pending posts
          const allPendingPosts = await prisma.post.findMany({
            where: {
              status: "pending",
            },
            include: { user: true, photo: true },
          });
          console.log(`Total pending posts: ${allPendingPosts.length}`);
          allPendingPosts.forEach(post => {
            console.log(`Pending post ${post.id} scheduled for: ${post.scheduledAt.toISOString()}`);
          });

          // Find posts that are due
          const posts = await prisma.post.findMany({
            where: {
              status: "pending",
              scheduledAt: { lte: now },
            },
            include: { user: true, photo: true },
          });

          console.log(`Found ${posts.length} posts due for processing`);

          for (const post of posts) {
            try {
              console.log(`Processing post ${post.id} scheduled for ${post.scheduledAt.toISOString()}`);
              
              if (!post.user.instagramBusinessAccountId || !post.user.instagramPageAccessToken) {
                console.error(`Post ${post.id} skipped: Instagram not connected`);
                await prisma.post.update({
                  where: { id: post.id },
                  data: { status: "failed" },
                });
                continue;
              }

              console.log(`Processing post ${post.id} with image URL: ${post.photo.url}`);
              const mediaRes = await axios.post(
                `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media`,
                {
                  image_url: post.photo.url,
                  caption: post.photo.caption || "No caption provided",
                },
                {
                  params: { access_token: post.user.instagramPageAccessToken },
                }
              );

              const creationId = mediaRes.data.id;
              console.log(`Post ${post.id} media created with ID: ${creationId}`);

              const publishRes = await axios.post(
                `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media_publish`,
                { creation_id: creationId },
                {
                  params: { access_token: post.user.instagramPageAccessToken },
                }
              );

              await prisma.post.update({
                where: { id: post.id },
                data: { status: "posted", postedAt: new Date() },
              });

              console.log(`Post ${post.id} published successfully`);
            } catch (error: any) {
              console.error(`Error publishing post ${post.id}:`, error.response?.data || error.message);
              await prisma.post.update({
                where: { id: post.id },
                data: { status: "failed" },
              });
            }
          }
        } catch (error: any) {
          console.error("Scheduler error:", error.message);
        }
      });
      this.isRunning = true;
      console.log("Scheduler started successfully");
    } catch (error: any) {
      console.error("Failed to start scheduler:", error.message);
    }
  }

  public stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log("Scheduler stopped");
  }
}

// Export a single instance
const scheduler = Scheduler.getInstance();
export { scheduler };