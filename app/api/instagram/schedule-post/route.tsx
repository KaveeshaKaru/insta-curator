import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface PhotoResult {
  id: number;
  url: string;
  caption: string | null;
}

interface PostResult {
  id: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caption, images, scheduledAt, seriesId, isCarousel = false } = await req.json();
    if (!caption || !images || !scheduledAt || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a Post record first
    const [post] = await prisma.$queryRaw<PostResult[]>`
      INSERT INTO "post" (
        "userId",
        "seriesId",
        "scheduledAt",
        "status",
        "caption",
        "isCarousel",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${session.user.id},
        ${seriesId ? parseInt(seriesId) : null},
        ${new Date(scheduledAt)},
        'pending',
        ${caption},
        ${isCarousel},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    // Create Photo records and post-photo relationships for each image
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      
      // Create Photo record
      const [photo] = await prisma.$queryRaw<PhotoResult[]>`
        INSERT INTO "photo" ("url", "caption", "userId", "seriesId", "createdAt", "updatedAt")
        VALUES (${imageUrl}, ${caption}, ${session.user.id}, ${seriesId ? parseInt(seriesId) : null}, NOW(), NOW())
        RETURNING *
      `;

      // Create post-photo relationship with order
      await prisma.$executeRaw`
        INSERT INTO "post_photo" ("postId", "photoId", "order", "createdAt", "updatedAt")
        VALUES (${post.id}, ${photo.id}, ${i}, NOW(), NOW())
      `;
    }

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error scheduling post:", error.message);
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 });
  }
}