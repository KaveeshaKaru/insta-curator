import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
// import { db } from "@/lib/db";
// import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    // Get user session (requires NextAuth)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Fetch user tokens (replace with actual DB query)
    // const user = await db.user.findUnique({
    //   where: { id: session.user.id },
    // });
    // const { instagramBusinessAccountId, instagramPageAccessToken } = user;

    // Mocked for now
    const instagramBusinessAccountId = "mock_ig_id";
    const instagramPageAccessToken = "mock_access_token";

    const res = await axios.get(
      `https://graph.facebook.com/v22.0/${instagramBusinessAccountId}?fields=username&access_token=${instagramPageAccessToken}`
    );

    return NextResponse.json({ username: res.data.username });
  } catch (err: any) {
    console.error("Error fetching Instagram username:", err.response?.data || err.message);
    return NextResponse.json({ error: "Failed to fetch username" }, { status: 500 });
  }
}