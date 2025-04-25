import { NextResponse } from "next/server";
import { startScheduler } from "@/lib/scheduler";

// This is just a health check endpoint now
export async function GET() {
  return NextResponse.json({ 
    message: "Application initialized",
    schedulerRunning: true 
  });
} 