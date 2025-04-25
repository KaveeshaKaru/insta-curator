import { NextResponse } from "next/server";
import { scheduler } from "@/lib/scheduler";

export async function GET() {
  scheduler.start();
  return NextResponse.json({ message: "Scheduler started" });
}