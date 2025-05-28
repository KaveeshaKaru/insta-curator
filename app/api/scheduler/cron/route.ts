import { NextResponse } from "next/server";
import { scheduler } from "@/lib/scheduler";

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

export async function GET() {
  try {
    // Check if scheduler is already running
    if (!scheduler.getStatus()) {
      await scheduler.start();
    }
    
    return NextResponse.json({ success: true, message: "Scheduler triggered successfully" });
  } catch (error: any) {
    console.error("Error in scheduler cron:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 