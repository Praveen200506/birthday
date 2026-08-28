import { NextRequest, NextResponse } from "next/server";
import { sendVisitorNotification } from "@/lib/visitorNotifier";

const VISITOR_COOKIE = "visitor_session_notified";

export async function POST(req: NextRequest) {
  try {
    const alreadyNotified = req.cookies.get(VISITOR_COOKIE)?.value;

    // Read payload if provided
    let page = "/";
    let referrer = "";
    try {
      const body = await req.json();
      page = body?.page || "/";
      referrer = body?.referrer || "";
    } catch {
      // Ignored if empty body
    }

    const response = NextResponse.json({ success: true });

    // Deduplicate: Send email only if not notified in current session/cooldown window
    if (!alreadyNotified) {
      // Set deduplication cookie (30 minutes)
      response.cookies.set(VISITOR_COOKIE, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 60, // 30 minutes
        path: "/",
      });

      // Extract minimal privacy-conscious metadata from headers
      const userAgent = req.headers.get("user-agent") || "";
      const ipCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null;
      const ipRegion = req.headers.get("x-vercel-ip-country-region") || null;
      const ipCity = req.headers.get("x-vercel-ip-city") || null;

      // Asynchronously trigger notification without blocking
      sendVisitorNotification({
        page,
        referrer,
        userAgent,
        ipCountry,
        ipRegion,
        ipCity,
      }).catch((err) => {
        console.error("Async visitor notification error:", err);
      });
    }

    return response;
  } catch (error) {
    console.error("Notify visit route error:", error);
    return NextResponse.json({ success: false }, { status: 200 }); // Return 200 so visitor is never disturbed
  }
}
