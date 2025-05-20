import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

    // Create Post record first
    const [post] = await prisma.$queryRaw<PostWithSeries[]>`
      INSERT INTO "post" ("userId", "scheduledAt", "status", "createdAt", "updatedAt")
      VALUES (${session.user.id}, NOW(), 'pending', NOW(), NOW())
      RETURNING *
    `;

    try {
      if (isCarousel) {
        // Upload each media item as a carousel item
        const mediaIds = await Promise.all(
          images.map(async (imageUrl: string) => {
            const mediaRes = await axios.post<InstagramMediaResponse>(
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
          })
        );

        // Create carousel container
        const carouselRes = await axios.post<InstagramMediaResponse>(
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

        // Publish carousel
        const publishRes = await axios.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { creation_id: carouselRes.data.id },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        // Update post with Instagram media ID
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
        // Single image post
        const mediaRes = await axios.post<InstagramMediaResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
          {
            image_url: images[0],
            caption: caption || "No caption provided",
          },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        const publishRes = await axios.post<InstagramPublishResponse>(
          `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
          { creation_id: mediaRes.data.id },
          {
            params: { access_token: user.instagramPageAccessToken },
          }
        );

        // Update post with Instagram media ID
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
    } catch (error) {
      // If Instagram posting fails, update post status to failed
      await prisma.$executeRaw`
        UPDATE "post"
        SET "status" = 'failed'
        WHERE "id" = ${post.id}
      `;
      throw error;
    }
  } catch (error: any) {
    console.error("Error posting to Instagram:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to post to Instagram", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}