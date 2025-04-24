import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
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
        instagramBusinessAccountId: true,
        instagramPageAccessToken: true,
      },
    });

    if (!user?.instagramBusinessAccountId || !user?.instagramPageAccessToken) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    // Fetch Instagram username
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}?fields=username&access_token=${user.instagramPageAccessToken}`
    );

    return NextResponse.json({ username: response.data.username });
  } catch (error: any) {
    console.error("Error fetching Instagram username:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch username" }, { status: 500 });
  }
}