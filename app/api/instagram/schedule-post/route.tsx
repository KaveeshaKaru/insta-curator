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

    const { caption, imageUrl, scheduledAt, seriesId } = await req.json();
    if (!caption || !imageUrl || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a Photo record
    const [photo] = await prisma.$queryRaw<PhotoResult[]>`
      INSERT INTO "photo" ("url", "caption", "userId", "seriesId", "createdAt", "updatedAt")
      VALUES (${imageUrl}, ${caption}, ${session.user.id}, ${seriesId ? parseInt(seriesId) : null}, NOW(), NOW())
      RETURNING *
    `;

    // Create a Post record
    const [post] = await prisma.$queryRaw<PostResult[]>`
      INSERT INTO "post" (
        "userId",
        "seriesId",
        "scheduledAt",
        "status",
        "caption",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${session.user.id},
        ${seriesId ? parseInt(seriesId) : null},
        ${new Date(scheduledAt)},
        'pending',
        ${caption},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    // Create post-photo relationship
    await prisma.$executeRaw`
      INSERT INTO "post_photo" ("postId", "photoId", "order", "createdAt", "updatedAt")
      VALUES (${post.id}, ${photo.id}, 0, NOW(), NOW())
    `;

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error scheduling post:", error.message);
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 });
  }
}