import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured, withDbTimeout } from "@/lib/db";
import {
  BLOG_ADMIN_SESSION_COOKIE,
  verifyBlogAdminSession,
} from "@/lib/blogAuth";
import {
  createMemoryStorageClient,
  getMemoryStorageConfig,
  hasSecureMemoryAdminConfiguration,
} from "@/lib/memoryStorage";

export const runtime = "nodejs";

function canManageMemories(request: NextRequest): boolean {
  const token = request.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;
  return hasSecureMemoryAdminConfiguration() && verifyBlogAdminSession(token);
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "The memories database is not configured." },
      { status: 503 },
    );
  }

  try {
    const memories = await withDbTimeout(
      prisma.memory.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          caption: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      8000,
    );

    return NextResponse.json({ success: true, memories });
  } catch (error) {
    console.error("Failed to read memories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load memories. Check the database connection and apply the Prisma schema.",
      },
      { status: 503 },
    );
  }
}

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

  if (!canManageMemories(request)) {
    return NextResponse.json(
      { success: false, message: "Author login is required to add memories." },
      { status: 403 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not configured on the server." },
      { status: 503 },
    );
  }

  const storageConfig = getMemoryStorageConfig();
  const storage = createMemoryStorageClient();
  if (!storageConfig || !storage) {
    return NextResponse.json(
      {
        success: false,
        message: "Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  let body: { title?: unknown; caption?: unknown; storagePath?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const caption = typeof body.caption === "string" ? body.caption.trim() : "";
  const storagePath = typeof body.storagePath === "string" ? body.storagePath : "";

  if (!title || title.length > 120) {
    return NextResponse.json(
      { success: false, message: "A title of 1–120 characters is required." },
      { status: 400 },
    );
  }
  if (caption.length > 500) {
    return NextResponse.json(
      { success: false, message: "The caption must be 500 characters or fewer." },
      { status: 400 },
    );
  }

  const pathMatch = storagePath.match(
    /^memories\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(jpg|png|webp|gif)$/i,
  );
  if (!pathMatch) {
    return NextResponse.json(
      { success: false, message: "Invalid upload reference. Please upload the image again." },
      { status: 400 },
    );
  }

  const fileName = storagePath.slice("memories/".length);
  const { data: uploadedObjects, error: listError } = await storage.storage
    .from(storageConfig.bucket)
    .list("memories", { search: fileName, limit: 5 });

  if (listError) {
    console.error("Unable to verify uploaded memory:", listError.message);
    return NextResponse.json(
      { success: false, message: "Unable to verify the uploaded image in Supabase Storage." },
      { status: 502 },
    );
  }

  if (!uploadedObjects?.some((object) => object.name === fileName)) {
    return NextResponse.json(
      { success: false, message: "The uploaded image was not found in Supabase Storage. Please try again." },
      { status: 400 },
    );
  }

  const imageUrl = storage.storage.from(storageConfig.bucket).getPublicUrl(storagePath).data.publicUrl;

  try {
    const memory = await withDbTimeout(
      prisma.memory.create({
        data: { title, caption, imageUrl, storagePath },
        select: {
          id: true,
          title: true,
          caption: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      8000,
    );

    return NextResponse.json({ success: true, memory }, { status: 201 });
  } catch (error) {
    console.error("Failed to save memory metadata:", error);

    // Roll back the uploaded object on a definite database failure, so the
    // bucket does not fill with orphaned files when the schema is missing.
    const message = error instanceof Error ? error.message : "";
    if (!/timed out/i.test(message)) {
      const { error: cleanupError } = await storage.storage
        .from(storageConfig.bucket)
        .remove([storagePath]);
      if (cleanupError) {
        console.error("Memory upload cleanup failed:", cleanupError.message);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "The photo could not be saved. Check that the Memory table exists by running npx prisma db push.",
      },
      { status: 503 },
    );
  }
}
