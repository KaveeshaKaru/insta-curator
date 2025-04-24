import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.instagramBusinessAccountId || !user.instagramPageAccessToken) {
      return NextResponse.json({ isConnected: false });
    }

    // Fetch username
    const res = await axios.get(
      `https://graph.facebook.com/v22.0/${user.instagramBusinessAccountId}?fields=username&access_token=${user.instagramPageAccessToken}`
    );

    return NextResponse.json({
      isConnected: true,
      igId: user.instagramBusinessAccountId,
      username: res.data.username || null,
    });
  } catch (err: any) {
    console.error("Error fetching Instagram status:", err.response?.data || err.message);
    return NextResponse.json({ isConnected: false });
  }
}