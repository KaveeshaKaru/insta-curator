import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: { user: true, photo: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!post.user.instagramBusinessAccountId || !post.user.instagramPageAccessToken) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    // Create media
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

    // Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v22.0/${post.user.instagramBusinessAccountId}/media_publish`,
      { creation_id: creationId },
      {
        params: { access_token: post.user.instagramPageAccessToken },
      }
    );

    // Update post status
    await prisma.post.update({
      where: { id: post.id },
      data: { status: "posted", postedAt: new Date() },
    });

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error publishing post:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to publish post", details: error.response?.data || error.message }, { status: 500 });
  }
}