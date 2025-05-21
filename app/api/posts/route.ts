import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build the WHERE clause based on status
    const whereClause = status 
      ? Prisma.sql`WHERE p."userId" = ${session.user.id} AND p.status = ${status}`
      : Prisma.sql`WHERE p."userId" = ${session.user.id}`;

    const posts = await prisma.$queryRaw`
      WITH post_data AS (
        SELECT 
          p.id,
          p.status,
          p."scheduledAt",
          p."postedAt",
          p."igMediaId",
          p."isCarousel",
          p.caption,
          p."seriesId",
          s.id as "series_id",
          s.name as "series_name",
          json_agg(
            json_build_object(
              'id', ph.id,
              'url', ph.url,
              'caption', ph.caption
            ) ORDER BY pp."order"
          ) FILTER (WHERE ph.id IS NOT NULL) as photos
        FROM post p
        LEFT JOIN series s ON p."seriesId" = s.id
        LEFT JOIN post_photo pp ON p.id = pp."postId"
        LEFT JOIN photo ph ON pp."photoId" = ph.id
        ${whereClause}
        GROUP BY p.id, p.status, p."scheduledAt", p."postedAt", 
                 p."igMediaId", p."isCarousel", p.caption, p."seriesId",
                 s.id, s.name
      )
      SELECT 
        pd.id,
        pd.status,
        pd."scheduledAt",
        pd."postedAt",
        pd."igMediaId",
        pd."isCarousel",
        pd.caption,
        CASE 
          WHEN pd."series_id" IS NOT NULL THEN
            json_build_object(
              'id', pd."series_id",
              'name', pd."series_name"
            )
          ELSE NULL
        END as series,
        COALESCE(pd.photos, '[]'::json) as photos
      FROM post_data pd
      ORDER BY pd."scheduledAt" DESC
    `;

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
} 