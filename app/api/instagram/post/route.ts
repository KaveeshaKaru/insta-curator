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
      INSERT INTO "post" ("userId", "scheduledAt", "status", "createdAt", "updatedAt")
      VALUES (${session.user.id}, NOW(), 'pending', NOW(), NOW())
      RETURNING id
    `;

    try {
      const axiosInstance = axios.create({ timeout: TIMEOUT });

      if (isCarousel) {
        // Upload each media item as a carousel item with timeout
        const mediaPromises = images.map(async (imageUrl: string) => {
          const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
            `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
            {
              image_url: imageUrl,
              is_carousel_item: true,
            },
            {
              params: { access_token: user.instagramPageAccessToken },
            }
          );
          return mediaRes.data.id;
        });

        const mediaIds = await Promise.all(mediaPromises);

        // Create carousel container
        const carouselRes = await axiosInstance.post<InstagramMediaResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
          {
            media_type: "CAROUSEL",
            children: mediaIds,
            caption: caption || "No caption provided",
          },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        // Publish carousel with timeout
        const publishRes = await axiosInstance.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { creation_id: carouselRes.data.id },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        // Update post status
        await prisma.$executeRaw`
          UPDATE "post"
          SET "igMediaId" = ${publishRes.data.id},
              "status" = 'posted',
              "postedAt" = NOW(),
              "caption" = ${caption || null},
              "isCarousel" = true
          WHERE "id" = ${post.id}
        `;
      } else {
        // Single image post with timeout
        const mediaRes = await axiosInstance.post<InstagramMediaResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
          {
            image_url: images[0],
            caption: caption || "No caption provided",
          },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        const publishRes = await axiosInstance.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { creation_id: mediaRes.data.id },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        // Update post status
        await prisma.$executeRaw`
          UPDATE "post"
          SET "igMediaId" = ${publishRes.data.id},
              "status" = 'posted',
              "postedAt" = NOW(),
              "caption" = ${caption || null}
          WHERE "id" = ${post.id}
        `;
      }

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
      // If Instagram API fails, update post status to failed
      await prisma.$executeRaw`
        UPDATE "post"
        SET "status" = 'failed',
            "error" = ${error.message || "Unknown error"}
        WHERE "id" = ${post.id}
      `;

      console.error("Error publishing to Instagram:", error.response?.data || error.message);
      return NextResponse.json(
        { 
          error: "Failed to publish to Instagram", 
          details: error.response?.data?.error?.message || error.message 
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