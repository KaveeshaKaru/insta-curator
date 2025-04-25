import { NextResponse } from "next/server";
import "../lib/init-scheduler";

export async function GET() {
  return NextResponse.json({ message: "Application initialized" });
} 