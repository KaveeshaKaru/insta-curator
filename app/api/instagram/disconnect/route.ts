import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear Instagram tokens from database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        instagramAccessToken: null,
        instagramPageAccessToken: null,
        instagramBusinessAccountId: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error disconnecting Instagram:", error.message);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}