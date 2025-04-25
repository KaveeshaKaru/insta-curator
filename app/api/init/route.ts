import { NextResponse } from "next/server";
import { scheduler } from "@/lib/scheduler";

// This is just a health check endpoint now
export async function GET() {
  scheduler.start();
  return NextResponse.json({ 
    message: "Application initialized",
    schedulerRunning: true 
  });
} 