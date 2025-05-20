import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import axios from "axios";

interface InstagramMediaResponse {
  id: string;
}

interface PostWithPhoto {
  id: number;
  user: {
    instagramBusinessAccountId: string | null;
    instagramPageAccessToken: string | null;
  };
  photo: {
    url: string;
    caption: string | null;
  };
}

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

    // Get post with user and first photo using raw SQL
    const [post] = await prisma.$queryRaw<PostWithPhoto[]>`
      SELECT 
        p.id,
        json_build_object(
          'instagramBusinessAccountId', u."instagramBusinessAccountId",
          'instagramPageAccessToken', u."instagramPageAccessToken"
        ) as user,
        json_build_object(
          'url', ph.url,
          'caption', ph.caption
        ) as photo
      FROM post p
      JOIN "user" u ON p."userId" = u.id
      LEFT JOIN post_photo pp ON p.id = pp."postId"
      LEFT JOIN photo ph ON pp."photoId" = ph.id
      WHERE p.id = ${parseInt(postId)}
      ORDER BY pp.order ASC
      LIMIT 1
    `;

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!post.user.instagramBusinessAccountId || !post.user.instagramPageAccessToken) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    if (!post.photo) {
      return NextResponse.json({ error: "No photo found for post" }, { status: 400 });
    }

    // Create media
    const mediaRes = await axios.post<InstagramMediaResponse>(
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
      data: {
        status: "posted",
        postedAt: new Date(),
        igMediaId: creationId,
      },
    });

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error: any) {
    console.error("Error publishing post:", error.message);
    return NextResponse.json({ error: "Failed to publish post" }, { status: 500 });
  }
}