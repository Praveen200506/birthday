import { Metadata } from "next";
import { BlogPost } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import BlogAuthWrapper from "@/components/blog/BlogAuthWrapper";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { ArrowLeft, Clock, Calendar, User, BookOpen } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return {
      title: "Story | Journal",
    };
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.published) {
      return {
        title: "Story Not Found | Journal",
      };
    }

    return {
      title: `${post.title} | Journal`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    };
  } catch {
    return {
      title: "Story | Journal",
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: BlogPost | null = null;

  if (isDatabaseConfigured()) {
    try {
      post = await prisma.blogPost.findUnique({
        where: { slug },
      });
    } catch (err) {
      console.error("Error fetching post by slug:", err);
    }
  }

  if (!post || !post.published) {
    // If not found in DB or unpublished
    return (
      <main className="min-h-screen bg-warm-cream/40 pt-20 pb-28 px-4 flex items-center justify-center">
        <BlogAuthWrapper>
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl border border-white/60 text-center max-w-md mx-auto">
            <h2 className="text-3xl font-handwriting text-stone-800 mb-3">
              Story Not Found
            </h2>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              This story might still be a draft, moved, or waiting to be written.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mypink text-white text-xs font-medium shadow-md shadow-pink-200 hover:bg-pink-400 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Journal
            </Link>
          </div>
        </BlogAuthWrapper>
      </main>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-warm-cream/40 pt-16 pb-32">
      <BlogAuthWrapper>
        <article className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200/60 shadow-sm text-xs font-medium text-stone-600 hover:text-mypink transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to all stories</span>
            </Link>
          </div>

          {/* Article Paper Container */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/80 relative overflow-hidden">
            {/* Top Washi Tape Decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/50 backdrop-blur-sm -rotate-1 border border-yellow-300/30 z-20 shadow-sm" />

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-mypink/15 text-mypink border border-mypink/20">
                {post.category}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Calendar size={13} />
                {formattedDate}
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock size={13} />
                {post.readingTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Author Badge */}
            <div className="flex items-center gap-3 pb-8 mb-8 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mypink to-soft-pink text-white flex items-center justify-center shadow-md">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{post.authorName}</p>
                <p className="text-xs text-stone-400 font-sans">Author & Memory Keeper</p>
              </div>
            </div>

            {/* Optional Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg mb-10 bg-stone-100">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-900/10 mix-blend-overlay pointer-events-none" />
              </div>
            )}

            {/* Excerpt Lead */}
            {post.excerpt && (
              <p className="text-lg md:text-xl font-sans text-stone-600 font-normal italic leading-relaxed mb-8 pl-4 border-l-2 border-mypink/60 bg-rose-50/20 py-2 rounded-r-xl">
                {post.excerpt}
              </p>
            )}

            {/* Markdown Content */}
            <MarkdownRenderer content={post.content} />

            {/* Article Footer */}
            <div className="mt-14 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-400 font-handwriting text-xl">
                <span>Written with love & warm thoughts 💖</span>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mypink/10 hover:bg-mypink text-mypink hover:text-white text-xs font-semibold transition-all shadow-sm"
              >
                <BookOpen size={14} /> Read More Stories
              </Link>
            </div>
          </div>
        </article>
      </BlogAuthWrapper>
    </main>
  );
}
