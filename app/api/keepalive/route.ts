import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured, prisma, withDbTimeout } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Vercel invokes this route once per day. The query deliberately reads a real
 * application table; a constant-only RPC or SELECT 1 is not a useful signal of
 * application database activity.
 *
 * Set CRON_SECRET in Vercel to make scheduled invocations require the
 * Authorization: Bearer <CRON_SECRET> header automatically sent by Vercel.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (cronSecret && request.headers.get("authorization") !== "Bearer " + cronSecret) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized cron request." },
      { status: 401 },
    );
  }

  if (!isDatabaseConfigured()) {
    console.error("Supabase keep-alive skipped: DATABASE_URL is not configured.");
    return NextResponse.json(
      { ok: false, message: "The database connection is not configured." },
      { status: 503 },
    );
  }

  try {
    await withDbTimeout(
      prisma.$queryRaw<Array<{ id: string }>>`SELECT "id" FROM "BlogPost" LIMIT 1`,
      8000,
      "Supabase database keep-alive query timed out",
    );

    return NextResponse.json({
      ok: true,
      message: "A real application-table query completed successfully.",
      checkedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Supabase keep-alive database query failed:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to complete the Supabase database keep-alive query." },
      { status: 502 },
    );
  }
}
