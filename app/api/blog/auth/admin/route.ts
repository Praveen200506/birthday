import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  getBlogAdminSessionToken,
  verifyBlogAdminSession,
  BLOG_ADMIN_SESSION_COOKIE,
  checkRateLimit,
} from "@/lib/blogAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = verifyBlogAdminSession(token);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const { allowed, remaining } = checkRateLimit(`admin_${ip}`, 5, 60000);

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Please wait 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: `Invalid author password. (${remaining} attempts left)` },
        { status: 401 }
      );
    }

    const token = getBlogAdminSessionToken();
    const response = NextResponse.json({ success: true, message: "Author authenticated" });

    response.cookies.set(BLOG_ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Internal authentication error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(BLOG_ADMIN_SESSION_COOKIE);
  return response;
}
