import { NextRequest, NextResponse } from "next/server";
import {
  verifyBlogPin,
  getBlogReaderSessionToken,
  verifyBlogReaderSession,
  BLOG_SESSION_COOKIE,
  checkRateLimit,
} from "@/lib/blogAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(BLOG_SESSION_COOKIE)?.value;
  const isAuthenticated = verifyBlogReaderSession(token);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const { allowed, remaining } = checkRateLimit(`pin_${ip}`, 5, 60000);

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please wait 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string" || pin.length !== 4) {
      return NextResponse.json(
        { success: false, message: "A 4-digit PIN is required." },
        { status: 400 }
      );
    }

    const isValid = verifyBlogPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: `Incorrect PIN. (${remaining} attempts left)` },
        { status: 401 }
      );
    }

    const token = getBlogReaderSessionToken();
    const response = NextResponse.json({ success: true, message: "Unlocked" });

    response.cookies.set(BLOG_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Blog PIN verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal verification error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(BLOG_SESSION_COOKIE);
  return response;
}
