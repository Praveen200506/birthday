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

// GET /api/blog/posts/[id] - Fetch single post by ID or Slug
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const readerToken = req.cookies.get(BLOG_SESSION_COOKIE)?.value;
  const adminToken = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;

  const isReader = verifyBlogReaderSession(readerToken);
  const isAdmin = verifyBlogAdminSession(adminToken);

  if (!isReader && !isAdmin) {
    return NextResponse.json(
      { success: false, message: "Blog authentication required.", locked: true },
      { status: 401 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Database not configured." },
      { status: 503 }
    );
  }

  try {
    const post = await withDbTimeout(
      prisma.blogPost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      }),
      6000
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    // If post is not published and viewer is not admin, deny access
    if (!post.published && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Post not found or still a draft." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post." },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[id] - Update post (Admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const adminToken = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;

  if (!verifyBlogAdminSession(adminToken)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Author privileges required." },
      { status: 403 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Database not configured." },
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
      authorName,
      coverImage,
      category,
      published,
    } = body;

    const existing = await withDbTimeout(
      prisma.blogPost.findUnique({
        where: { id },
      }),
      6000
    );

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    const updateData: Prisma.BlogPostUpdateInput = {};

    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) {
      updateData.content = sanitizeHtml(content);
      updateData.readingTime = calculateReadingTime(updateData.content);
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
    if (authorName !== undefined) updateData.authorName = authorName.trim();
    if (coverImage !== undefined) updateData.coverImage = coverImage ? coverImage.trim() : null;
    if (category !== undefined) updateData.category = category.trim();
    if (published !== undefined) updateData.published = Boolean(published);

    if (customSlug && customSlug !== existing.slug) {
      const formattedSlug = slugify(customSlug);
      // Check if unique
      const slugConflict = await withDbTimeout(
        prisma.blogPost.findUnique({
          where: { slug: formattedSlug },
        }),
        6000
      );
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, message: "Slug already exists. Please choose another." },
          { status: 400 }
        );
      }
      updateData.slug = formattedSlug;
    }

    const updatedPost = await withDbTimeout(
      prisma.blogPost.update({
        where: { id },
        data: updateData,
      }),
      8000
    );

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: "Post updated successfully!",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    const errMsg = (error as Error)?.message || "";
    const isConnError = errMsg.includes("Can't reach database") || errMsg.includes("timed out") || errMsg.includes("InitializationError");

    return NextResponse.json(
      {
        success: false,
        message: isConnError
          ? "Database connection timed out or is temporarily unreachable."
          : "Failed to update post.",
      },
      { status: isConnError ? 503 : 500 }
    );
  }
}

// DELETE /api/blog/posts/[id] - Delete post (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const adminToken = req.cookies.get(BLOG_ADMIN_SESSION_COOKIE)?.value;

  if (!verifyBlogAdminSession(adminToken)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Author privileges required." },
      { status: 403 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Database not configured." },
      { status: 503 }
    );
  }

  try {
    await withDbTimeout(
      prisma.blogPost.delete({
        where: { id },
      }),
      6000
    );

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    const errMsg = (error as Error)?.message || "";
    const isConnError = errMsg.includes("Can't reach database") || errMsg.includes("timed out") || errMsg.includes("InitializationError");

    return NextResponse.json(
      {
        success: false,
        message: isConnError
          ? "Database connection timed out or is temporarily unreachable."
          : "Failed to delete post.",
      },
      { status: isConnError ? 503 : 500 }
    );
  }
}
