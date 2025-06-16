import { NextResponse, NextRequest } from "next/server";
import { scheduler } from "@/lib/scheduler";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time

// This endpoint will be triggered by cron service
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from a trusted source
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Cron job triggered at:", new Date().toISOString());

    // Check if scheduler is already running
    if (!scheduler.getStatus()) {
      await scheduler.start();
    }

    // Get count of pending posts
    const pendingPosts = await prisma.post.count({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: new Date()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Scheduler triggered successfully",
      pendingPosts,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error in scheduler cron:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 