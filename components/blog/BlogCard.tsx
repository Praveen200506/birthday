"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Calendar, User, ArrowUpRight } from "lucide-react";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorName: string;
  coverImage?: string | null;
  category: string;
  readingTime: string;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface BlogCardProps {
  post: BlogPostItem;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <motion.article
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
        className="relative bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] p-4 xs:p-6 md:p-8 shadow-xl border border-white/80 overflow-hidden group mb-8 sm:mb-12"
      >
        {/* Subtle Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-200/50 backdrop-blur-xs -rotate-1 border border-yellow-300/30 z-20 shadow-xs" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
          {post.coverImage ? (
            <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-stone-100">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center p-6 sm:p-8 text-center">
              <span className="font-handwriting text-3xl sm:text-4xl text-mypink/60 select-none">
                Featured Story ✨
              </span>
            </div>
          )}

          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-xs font-medium bg-mypink/15 text-mypink border border-mypink/20">
                  {post.category}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider font-semibold">
                  ★ Featured Story
                </span>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl xs:text-2xl md:text-4xl font-serif font-bold text-stone-800 group-hover:text-mypink transition-colors leading-snug mb-3">
                  {post.title}
                </h2>
              </Link>

              <p className="text-stone-600 font-sans text-xs xs:text-sm md:text-base leading-relaxed line-clamp-3 mb-5 sm:mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-3.5 border-t border-stone-100 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-stone-500 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1.5 font-medium text-stone-700">
                  <User size={13} className="text-mypink" />
                  {post.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-stone-400" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-stone-400" />
                  {post.readingTime}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-mypink hover:underline group/btn shrink-0"
              >
                Read Story
                <ArrowUpRight
                  size={14}
                  className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 shadow-md hover:shadow-xl border border-white/70 flex flex-col justify-between transition-shadow group relative overflow-hidden"
    >
      {/* Tiny corner decoration */}
      <div className="absolute top-0 right-0 w-14 h-14 bg-mypink/5 rounded-bl-full pointer-events-none" />

      <div>
        {post.coverImage ? (
          <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 bg-stone-100 shadow-xs">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 bg-gradient-to-br from-pink-50 via-rose-50/50 to-purple-50 flex items-center justify-center p-4">
            <span className="font-handwriting text-2xl text-mypink/50 select-none">
              A gentle memory 🌸
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-mypink/10 text-mypink border border-mypink/20">
            {post.category}
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-400 flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-base sm:text-lg md:text-xl font-bold font-serif text-stone-800 group-hover:text-mypink transition-colors leading-snug mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-stone-500 font-sans text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] sm:text-xs text-stone-400">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className="font-medium text-stone-600 flex items-center gap-1 truncate">
            <User size={11} className="text-mypink shrink-0" />
            <span className="truncate">{post.authorName}</span>
          </span>
          <span>•</span>
          <span className="shrink-0">{formattedDate}</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="text-mypink font-semibold hover:underline flex items-center gap-0.5 shrink-0"
        >
          Read <ArrowUpRight size={11} />
        </Link>
      </div>
    </motion.article>
  );
}
