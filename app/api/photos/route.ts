import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const photos = await prisma.photo.findMany({
      where: { userId: session.user.id },
      select: { id: true, url: true, caption: true },
    });

    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error("Error fetching photos:", error.message);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, caption } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    const photo = await prisma.photo.create({
      data: {
        url,
        caption: caption || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ photo });
  } catch (error: any) {
    console.error("Error creating photo:", error.message);
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
  }
}