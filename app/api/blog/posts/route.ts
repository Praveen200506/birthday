import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured, withDbTimeout } from "@/lib/db";
import {
  verifyBlogAdminSession,
  verifyBlogReaderSession,
  BLOG_ADMIN_SESSION_COOKIE,
  BLOG_SESSION_COOKIE,
} from "@/lib/blogAuth";
import { calculateReadingTime, slugify, sanitizeHtml } from "@/lib/blogUtils";

// GET /api/blog/posts - List posts
export async function GET(req: NextRequest) {
  // Check reader or admin session
  const readerToken = req.cookies.get(BLOG_SESSION_COOKIE)?.value;
  const adminToken = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;

  const isReader = verifyBlogReaderSession(readerToken);
  const isAdmin = verifyBlogAdminSession(adminToken);

  if (!isReader && !isAdmin) {
    return NextResponse.json(
      { success: false, message: "Blog PIN authentication required.", locked: true },
      { status: 401 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      success: true,
      posts: [],
      dbConfigured: false,
      message: "Database not yet configured. Please set DATABASE_URL in environment.",
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeDrafts = searchParams.get("all") === "true" && isAdmin;

    const where: Prisma.BlogPostWhereInput = {};

    if (!includeDrafts) {
      where.published = true;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await withDbTimeout(
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      1500
    );

    return NextResponse.json({
      success: true,
      posts,
      dbConfigured: true,
    });
  } catch (error: unknown) {
    console.error("Error fetching blog posts (database unreachable or connecting):", (error as Error)?.message || error);
    return NextResponse.json({
      success: true,
      posts: [],
      dbConfigured: true,
      dbError: true,
      message: "Database is connecting or temporarily unreachable.",
    });
  }
}

// POST /api/blog/posts - Create post (Anyone with Blog PIN / access)
export async function POST(req: NextRequest) {
  const readerToken = req.cookies.get(BLOG_SESSION_COOKIE)?.value;
  const adminToken = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;

  const isReader = verifyBlogReaderSession(readerToken);
  const isAdmin = verifyBlogAdminSession(adminToken);

  if (!isReader && !isAdmin) {
    return NextResponse.json(
      { success: false, message: "Blog PIN authentication required to write stories.", locked: true },
      { status: 401 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      content,
      excerpt,
      authorName = "A Friend",
      coverImage,
      category = "Memories",
      published = true,
    } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Post title is required." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Post content is required." },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();
    let finalSlug = customSlug ? slugify(customSlug) : slugify(cleanTitle);
    if (!finalSlug) finalSlug = `story-${Date.now()}`;

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const cleanContent = sanitizeHtml(content);
    const cleanExcerpt = excerpt?.trim() || cleanContent.slice(0, 160).replace(/[#*`_]/g, "") + "...";
    const readingTime = calculateReadingTime(cleanContent);

    const post = await prisma.blogPost.create({
      data: {
        title: cleanTitle,
        slug: finalSlug,
        content: cleanContent,
        excerpt: cleanExcerpt,
        authorName: authorName.trim() || "Praveen",
        coverImage: coverImage?.trim() || null,
        category: category.trim() || "Memories",
        readingTime,
        published: Boolean(published),
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message: published ? "Post published successfully!" : "Draft saved successfully!",
    });
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post.",
        error: process.env.NODE_ENV === "development" ? (error as Error)?.message : undefined,
      },
      { status: 500 }
    );
  }
}
