import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await prisma.series.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    });

    return NextResponse.json({ series });
  } catch (error: any) {
    console.error("Error fetching series:", error.message);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}