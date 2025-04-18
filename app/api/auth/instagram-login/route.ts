// app/api/auth/instagram-login/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const clientId = process.env.INSTAGRAM_APP_ID!
  const redirectUri = `${process.env.BASE_URL}/api/auth/instagram-callback`;
  console.log("Redirect URI:", redirectUri);

  const authUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&response_type=code`

  return NextResponse.redirect(authUrl)
}
