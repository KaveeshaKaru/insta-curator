import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  if (!process.env.INSTAGRAM_APP_ID || !process.env.BETTER_AUTH_URL) {
    console.error("Missing INSTAGRAM_APP_ID or BASE_URL in environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const clientId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/auth/instagram-callback`;
  const state = crypto.randomUUID(); // CSRF protection

  const authUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,business_management&response_type=code&state=${state}`;

  console.log("Initiating OAuth with redirect URI:", redirectUri);
  return NextResponse.redirect(authUrl);
}