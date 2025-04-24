// lib/scheduler.ts
import cron from "node-cron";
import prisma from "@/lib/prisma";
import axios from "axios";

export function startScheduler() {
  try {
    console.log("Starting scheduler at", new Date().toISOString());
    cron.schedule("* * * * *", async () => {
      try {
        console.log("Scheduler running at", new Date().toISOString());
        const now = new Date(new Date().toUTCString()); // Ensure UTC
        const posts = await prisma.post.findMany({
          where: {
            status: "pending",
            scheduledAt: { lte: now },
          },
          include: { user: true, photo: true },
        });

        console.log(`Found ${posts.length} pending posts to process`);

        for (const post of posts) {
          try {
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
    console.log("Scheduler started successfully");
  } catch (error: any) {
    console.error("Failed to start scheduler:", error.message);
  }
}