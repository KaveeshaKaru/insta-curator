import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const posts = await prisma.$queryRaw`
      SELECT 
        p.*,
        s.*,
        COALESCE(
          json_agg(
            json_build_object(
              'photo', json_build_object(
                'id', ph.id,
                'url', ph.url,
                'caption', ph.caption
              )
            )
          ) FILTER (WHERE pp.id IS NOT NULL),
          '[]'
        ) as photos
      FROM post p
      LEFT JOIN series s ON p."seriesId" = s.id
      LEFT JOIN post_photo pp ON p.id = pp."postId"
      LEFT JOIN photo ph ON pp."photoId" = ph.id
      WHERE p."userId" = ${session.user.id}
        ${status ? `AND p.status = ${status}` : ''}
      GROUP BY p.id, s.id
      ORDER BY p."scheduledAt" DESC
    `;

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
} 