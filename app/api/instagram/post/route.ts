import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const TIMEOUT = 50000; // 50 seconds timeout

interface InstagramMediaResponse {
  id: string;
}

interface InstagramPublishResponse {
  id: string;
}

interface PostWithSeries {
  id: number;
  userId: string;
  scheduledAt: Date;
  status: string;
  postedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  igMediaId: string | null;
  isCarousel: boolean;
  caption: string | null;
  seriesId: number | null;
}

interface PhotoResult {
  id: number;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.$queryRaw<PostWithSeries[]>`
      SELECT p.*, s.*
      FROM "post" p
      LEFT JOIN "series" s ON p."seriesId" = s.id
      WHERE p."userId" = ${session.user.id}
      ORDER BY p."createdAt" DESC
    `;

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        instagramPageAccessToken: true,
        instagramBusinessAccountId: true,
      },
    });

    if (!user?.instagramPageAccessToken || !user?.instagramBusinessAccountId) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    const { caption, images, isCarousel = false } = await req.json();
    if (!images || !images.length) {
      return NextResponse.json({ error: "At least one image URL is required" }, { status: 400 });
    }

    if (isCarousel && images.length > 10) {
      return NextResponse.json({ error: "Maximum 10 images allowed for carousel" }, { status: 400 });
    }

    // Create Post record first with pending status
    const [post] = await prisma.$queryRaw<{ id: number }[]>`
      INSERT INTO "post" ("userId", "scheduledAt", "status", "createdAt", "updatedAt", "isCarousel")
      VALUES (${session.user.id}, NOW(), 'pending', NOW(), NOW(), ${isCarousel})
      RETURNING id
    `;

    try {
      const axiosInstance = axios.create({ 
        timeout: TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let publishRes;

      if (isCarousel) {
        console.log('Starting carousel post process...');
        
        // Upload each media item as a carousel item with timeout
        const mediaIds = [];
        for (const [index, imageUrl] of images.entries()) {
          try {
            console.log(`Uploading image ${index + 1}/${images.length}...`);
            const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
              `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
              {
                image_url: imageUrl,
                is_carousel_item: true,
                access_token: user.instagramPageAccessToken
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
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
          {
            media_type: "CAROUSEL",
            children: mediaIds,
            caption: caption || "No caption provided",
            access_token: user.instagramPageAccessToken
          }
        ).catch((error) => {
          console.error('Error creating carousel:', error.response?.data || error.message);
          throw new Error(`Failed to create carousel: ${error.response?.data?.error?.message || error.message}`);
        });

        console.log('Carousel container created, publishing...');

        // Publish carousel
        publishRes = await axiosInstance.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { 
            creation_id: carouselRes.data.id,
            access_token: user.instagramPageAccessToken
          }
        ).catch((error) => {
          console.error('Error publishing carousel:', error.response?.data || error.message);
          throw new Error(`Failed to publish carousel: ${error.response?.data?.error?.message || error.message}`);
        });

        console.log('Carousel published successfully');
      } else {
        // Single image post
        console.log('Starting single image post process...');
        
        const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
          {
            image_url: images[0],
            caption: caption || "No caption provided",
            access_token: user.instagramPageAccessToken
          }
        ).catch((error) => {
          console.error('Error creating media:', error.response?.data || error.message);
          throw new Error(`Failed to create media: ${error.response?.data?.error?.message || error.message}`);
        });

        console.log('Image uploaded, publishing...');

        publishRes = await axiosInstance.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { 
            creation_id: mediaRes.data.id,
            access_token: user.instagramPageAccessToken
          }
        ).catch((error) => {
          console.error('Error publishing media:', error.response?.data || error.message);
          throw new Error(`Failed to publish media: ${error.response?.data?.error?.message || error.message}`);
        });

        console.log('Image published successfully');
      }

      // Update post status
      await prisma.$executeRaw`
        UPDATE "post"
        SET "igMediaId" = ${publishRes.data.id},
            "status" = 'posted',
            "postedAt" = NOW(),
            "caption" = ${caption || null}
        WHERE "id" = ${post.id}
      `;

      // Create photos and post-photo relationships
      await Promise.all(
        images.map(async (imageUrl: string, index: number) => {
          // Create photo
          const [photo] = await prisma.$queryRaw<PhotoResult[]>`
            INSERT INTO "photo" ("url", "userId", "createdAt", "updatedAt")
            VALUES (${imageUrl}, ${session.user.id}, NOW(), NOW())
            RETURNING *
          `;

          // Create post-photo relationship
          await prisma.$executeRaw`
            INSERT INTO "post_photo" ("postId", "photoId", "order", "createdAt", "updatedAt")
            VALUES (${post.id}, ${photo.id}, ${index}, NOW(), NOW())
          `;
        })
      );

      return NextResponse.json({ success: true, postId: post.id });
    } catch (error: any) {
      // If Instagram API fails, update post status to failed with detailed error
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error("Detailed error:", {
        message: errorMessage,
        response: error.response?.data,
        stack: error.stack
      });

      await prisma.$executeRaw`
        UPDATE "post"
        SET "status" = 'failed',
            "error" = ${errorMessage}
        WHERE "id" = ${post.id}
      `;

      return NextResponse.json(
        { 
          error: "Failed to publish to Instagram", 
          details: errorMessage
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in post route:", error);
    return NextResponse.json(
      { 
        error: "An error occurred while publishing the post",
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}