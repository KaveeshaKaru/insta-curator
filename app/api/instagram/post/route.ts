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

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: session.user.id },
      include: {
        photo: true,
        series: true,
      },
      orderBy: { createdAt: "desc" },
    });

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

    const { caption, imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Create Photo record
    const photo = await prisma.photo.create({
      data: {
        url: imageUrl,
        caption: caption || null,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create media object
    const mediaRes = await axios.post<InstagramMediaResponse>(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
      {
        image_url: imageUrl,
        caption: caption || "No caption provided",
      },
      {
        params: { access_token: user.instagramPageAccessToken },
      }
    );

    const creationId = mediaRes.data.id;

    // Publish media
    const publishRes = await axios.post<InstagramPublishResponse>(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
      { creation_id: creationId },
      {
        params: { access_token: user.instagramPageAccessToken },
      }
    );

    // Create Post record
    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        photoId: photo.id,
        scheduledAt: new Date(), // Set to now since it's posted immediately
        status: "posted",
        postedAt: new Date(),
        igMediaId: publishRes.data.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error posting to Instagram:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to post to Instagram", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}