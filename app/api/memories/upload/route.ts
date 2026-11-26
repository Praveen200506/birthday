import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma, isDatabaseConfigured, withDbTimeout } from "@/lib/db";
import { checkRateLimit } from "@/lib/blogAuth";
import {
  createMemoryStorageClient,
  getMemoryStorageConfig,
  MAX_MEMORY_IMAGE_BYTES,
  MEMORY_IMAGE_TYPES,
} from "@/lib/memoryStorage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || request.headers.get("host");
  if (origin) {
    try {
      if (!host || new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
        return NextResponse.json({ success: false, message: "Upload from this website only." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
    }
  }

  const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  const limit = checkRateLimit("memory-upload:" + ip.slice(0, 120), 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, message: "Too many upload attempts. Please try again in a few minutes." }, { status: 429 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ success: false, message: "DATABASE_URL is not configured on the server." }, { status: 503 });
  }

  const storageConfig = getMemoryStorageConfig();
  const storage = createMemoryStorageClient();
  if (!storageConfig || !storage) {
    return NextResponse.json({ success: false, message: "Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in Vercel server environment variables." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid upload form." }, { status: 400 });
  }

  const file = form.get("file");
  const title = typeof form.get("title") === "string" ? String(form.get("title")).trim() : "";
  const caption = typeof form.get("caption") === "string" ? String(form.get("caption")).trim() : "";

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "Choose an image to upload." }, { status: 400 });
  }
  const extension = MEMORY_IMAGE_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ success: false, message: "Only JPG, PNG, WebP, and GIF images are accepted." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_MEMORY_IMAGE_BYTES) {
    return NextResponse.json({ success: false, message: "The image must be larger than 0 bytes and no more than 15 MB." }, { status: 413 });
  }
  if (!title || title.length > 120 || caption.length > 500) {
    return NextResponse.json({ success: false, message: "A title of 1–120 characters and a caption of at most 500 characters are required." }, { status: 400 });
  }

  const storagePath = "memories/" + randomUUID() + "." + extension;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await storage.storage.from(storageConfig.bucket).upload(storagePath, bytes, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) {
      console.error("Supabase memory upload failed:", uploadError.message);
      return NextResponse.json({ success: false, message: "Supabase could not store the image. Check the bucket and service-role permissions." }, { status: 502 });
    }

    const imageUrl = storage.storage.from(storageConfig.bucket).getPublicUrl(storagePath).data.publicUrl;
    try {
      const memory = await withDbTimeout(
        prisma.memory.create({
          data: { title, caption, imageUrl, storagePath },
          select: { id: true, title: true, caption: true, imageUrl: true, createdAt: true },
        }),
        8000,
      );
      return NextResponse.json({ success: true, memory }, { status: 201 });
    } catch (dbError) {
      console.error("Failed to save memory metadata:", dbError);
      const { error: cleanupError } = await storage.storage.from(storageConfig.bucket).remove([storagePath]);
      if (cleanupError) console.error("Memory upload cleanup failed:", cleanupError.message);
      return NextResponse.json({ success: false, message: "The image uploaded, but its memory could not be saved. Check that the Memory table exists by running npx prisma db push." }, { status: 503 });
    }
  } catch (error) {
    console.error("Unexpected memory upload error:", error);
    return NextResponse.json({ success: false, message: "Unable to upload this memory. Please try again." }, { status: 502 });
  }
}
