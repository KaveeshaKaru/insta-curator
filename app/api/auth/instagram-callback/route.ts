import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"; // Adjust path to your Prisma client
import { auth } from "@/lib/auth"; // Adjust path to your Better Auth instance

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    console.error("No authorization code provided");
    return NextResponse.redirect(`${process.env.BETTER_AUTH_URL}/settings?connected=false&error=no_code`);
  }

  // Get session using Better Auth's getSession
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.redirect(`${process.env.BETTER_AUTH_URL}/settings?connected=false&error=unauthorized`);
  }
  const userId = session.user.id;

  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/auth/instagram-callback`;

  try {
    if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET || !process.env.BETTER_AUTH_URL) {
      throw new Error("Missing required environment variables");
    }

    // Step 1: Get access token
    const tokenRes = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        redirect_uri: redirectUri,
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;

    // Step 2: Get Facebook Pages
    const pagesRes = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`);
    if (!pagesRes.data.data.length) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/settings?connected=false&error=no_pages`
      );
    }
    const page = pagesRes.data.data[0];
    const pageId = page.id;
    const pageAccessToken = page.access_token;

    // Step 3: Get Instagram Business Account
    const igRes = await axios.get(
      `https://graph.facebook.com/v22.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    const igBusinessAccount = igRes.data.instagram_business_account;
    if (!igBusinessAccount) {
      return NextResponse.redirect(
        `${process.env.BETTER_AUTH_URL}/settings?connected=false&error=no_instagram`
      );
    }

    // Step 4: Store tokens in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        instagramAccessToken: accessToken,
        instagramPageAccessToken: pageAccessToken,
        instagramBusinessAccountId: igBusinessAccount.id,
      },
    });

    return NextResponse.redirect(
      `${process.env.BETTER_AUTH_URL}/settings?connected=true&ig_id=${igBusinessAccount.id}&state=${state}`
    );
  } catch (err: any) {
    console.error("OAuth Error:", err.response?.data || err.message);
    return NextResponse.redirect(`${process.env.BETTER_AUTH_URL}/settings?connected=false&error=auth_failed`);
  }
}