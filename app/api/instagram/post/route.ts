import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from Prisma
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

    // Parse request body
    const { caption, imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Step 1: Create a media object
    const mediaRes = await axios.post(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media`,
      {
        image_url: imageUrl,
        caption,
      },
      {
        params: { access_token: user.instagramPageAccessToken },
      }
    );

    const creationId = mediaRes.data.id;

    // Step 2: Publish the media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}/media_publish`,
      { creation_id: creationId },
      {
        params: { access_token: user.instagramPageAccessToken },
      }
    );

    return NextResponse.json({ success: true, postId: publishRes.data.id });
  } catch (error: any) {
    console.error("Error posting to Instagram:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to post to Instagram" }, { status: 500 });
  }
}