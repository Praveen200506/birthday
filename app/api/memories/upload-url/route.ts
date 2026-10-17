import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  BLOG_ADMIN_SESSION_COOKIE,
  verifyBlogAdminSession,
} from "@/lib/blogAuth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  createMemoryStorageClient,
  getMemoryStorageConfig,
  hasSecureMemoryAdminConfiguration,
  MAX_MEMORY_IMAGE_BYTES,
  MEMORY_IMAGE_TYPES,
} from "@/lib/memoryStorage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasSecureMemoryAdminConfiguration()) {
    return NextResponse.json(
      {
        success: false,
        message: "Configure BLOG_ADMIN_PASSWORD_HASH and BLOG_ADMIN_SESSION_SECRET before enabling memory uploads in production.",
      },
      { status: 503 },
    );
  }

  const adminToken = request.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;
  if (!verifyBlogAdminSession(adminToken)) {
    return NextResponse.json(
      { success: false, message: "Author login is required to upload images." },
      { status: 403 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not configured on the server." },
      { status: 503 },
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for browser uploads.",
      },
      { status: 503 },
    );
  }

  const storageConfig = getMemoryStorageConfig();
  const storage = createMemoryStorageClient();
  if (!storageConfig || !storage) {
    return NextResponse.json(
      {
        success: false,
        message: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server to enable secure image uploads.",
      },
      { status: 503 },
    );
  }

  let body: { contentType?: unknown; size?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const size = typeof body.size === "number" ? body.size : 0;
  const extension = MEMORY_IMAGE_TYPES[contentType];

  if (!extension) {
    return NextResponse.json(
      { success: false, message: "Only JPG, PNG, WebP, and GIF images are accepted." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(size) || size <= 0 || size > MAX_MEMORY_IMAGE_BYTES) {
    return NextResponse.json(
      { success: false, message: "The image must be larger than 0 bytes and no more than 8 MB." },
      { status: 413 },
    );
  }

  const storagePath = "memories/" + randomUUID() + "." + extension;

  try {
    const { data, error } = await storage.storage
      .from(storageConfig.bucket)
      .createSignedUploadUrl(storagePath, { upsert: false });

    if (error || !data?.token) {
      console.error("Failed to create signed memory upload URL:", error?.message);
      return NextResponse.json(
        { success: false, message: "Supabase could not prepare the upload. Check that the bucket exists." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      bucket: storageConfig.bucket,
      path: storagePath,
      token: data.token,
    });
  } catch (error) {
    console.error("Unexpected signed memory upload error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to prepare a Supabase upload." },
      { status: 502 },
    );
  }
}
