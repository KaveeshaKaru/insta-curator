import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    const photo = await prisma.photo.create({
      data: {
        url: imageUrl,
        caption,
        userId: session.user.id,
        seriesId: seriesId ? parseInt(seriesId) : null,
      },
    });

    // Create a Post record
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        photoId: photo.id,
        seriesId: seriesId ? parseInt(seriesId) : null,
        scheduledAt: new Date(scheduledAt),
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error scheduling post:", error.message);
    return NextResponse.json({ error: "Failed to schedule post" }, { status: 500 });
  }
}