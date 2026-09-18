import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type KeepAliveResponse = {
  ok: boolean;
  message: string;
};

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function GET(): Promise<NextResponse<KeepAliveResponse>> {
  const config = getSupabaseConfig();

  if (!config) {
    console.error(
      "Keep-alive configuration error: SUPABASE_URL and SUPABASE_ANON_KEY must be set.",
    );
    return NextResponse.json(
      { ok: false, message: "Supabase environment variables are not configured." },
      { status: 500 },
    );
  }

  try {
    const supabase = createSupabaseClient(config);
    const { error: rpcError } = await supabase.rpc("keep_alive");

    if (!rpcError) {
      return NextResponse.json({ ok: true, message: "Supabase is active." });
    }

    // The RPC is preferred. The fallback keeps this endpoint useful before the
    // optional SQL function has been created, using the app's existing table.
    const { error: selectError } = await supabase
      .from("BlogPost")
      .select("id")
      .limit(1);

    if (selectError) {
      console.error("Supabase keep-alive failed:", {
        rpcCode: rpcError.code,
        rpcMessage: rpcError.message,
        selectCode: selectError.code,
        selectMessage: selectError.message,
      });
      return NextResponse.json(
        { ok: false, message: "Supabase keep-alive operation failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, message: "Supabase is active." });
  } catch (error: unknown) {
    console.error("Unexpected Supabase keep-alive error:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to reach Supabase." },
      { status: 502 },
    );
  }
}
