// app/api/auth/instagram-callback/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  const redirectUri = `${process.env.BASE_URL}/api/auth/instagram-callback`

  try {
    // Step 1: Get access token
    const tokenRes = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        redirect_uri: redirectUri,
        code,
      },
    })

    const accessToken = tokenRes.data.access_token

    // Step 2: Get Facebook Pages
    const pagesRes = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`)
    const page = pagesRes.data.data[0]
    const pageId = page.id
    const pageAccessToken = page.access_token

    // Step 3: Get Instagram Business Account
    const igRes = await axios.get(
      `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    )

    const igBusinessAccount = igRes.data.instagram_business_account

    return NextResponse.redirect(
      `${process.env.BASE_URL}/settings?connected=true&ig_id=${igBusinessAccount.id}`
    )
  } catch (err) {
    console.error("OAuth Error:", err)
    return NextResponse.redirect(`${process.env.BASE_URL}/settings?connected=false`)
  }
}
