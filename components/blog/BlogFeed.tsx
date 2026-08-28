"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Feather, PlusCircle } from "lucide-react";
import Link from "next/link";
import BlogCard, { BlogPostItem } from "./BlogCard";

const CATEGORIES = ["All", "Memories", "Stories", "Thoughts", "Wishes", "Adventures"];

export default function BlogFeed() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog/posts");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setDbConfigured(data.dbConfigured !== false);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.length > 0 && selectedCategory === "All" && searchQuery === ""
    ? filteredPosts[0]
    : null;

  const remainingPosts = featuredPost
    ? filteredPosts.slice(1)
    : filteredPosts;

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/85 border border-mypink/20 shadow-xs text-xs md:text-sm text-mypink font-medium mb-3 sm:mb-4">
          <Feather size={13} />
          <span>A Little Corner For Things I Want To Share</span>
        </div>

        <h1 className="text-3xl xs:text-4xl md:text-6xl font-handwriting text-stone-800 mb-2 sm:mb-3 tracking-wide">
          Our Little Stories & Journal
        </h1>
        <p className="text-stone-500 font-sans text-xs xs:text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed">
          stories • thoughts • memories • little reflections
        </p>
      </motion.div>

      {/* Filter & Search Bar */}
      <div className="mb-8 sm:mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 xs:gap-2 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? "bg-mypink text-white shadow-sm shadow-pink-200"
                  : "bg-white/80 text-stone-600 hover:bg-white border border-stone-200/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Write & Search Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full bg-white/85 backdrop-blur-xs border border-stone-200/70 rounded-full pl-9 pr-3.5 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-700 placeholder:text-stone-400"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          <Link
            href="/blog/write"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-mypink hover:bg-pink-400 text-white text-xs md:text-sm font-semibold shadow-sm shadow-pink-200 transition-all shrink-0"
          >
            <Feather size={13} />
            <span>Write</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[260px] flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-7 h-7 border-2 border-mypink border-t-transparent rounded-full"
          />
          <p className="text-xs text-stone-400 font-handwriting text-base sm:text-lg">
            Opening the journal pages...
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] p-6 xs:p-8 md:p-14 text-center max-w-xl mx-auto shadow-md border border-white/60 my-6"
        >
          <div className="w-14 h-14 rounded-full bg-mypink/10 text-mypink flex items-center justify-center mx-auto mb-3.5 text-2xl">
            📖
          </div>
          <h3 className="text-2xl md:text-3xl font-handwriting text-stone-800 mb-2">
            No Stories Found
          </h3>
          <p className="text-stone-500 text-xs md:text-sm mb-5 max-w-md mx-auto leading-relaxed">
            {!dbConfigured
              ? "The journal is ready! Configure the database in the environment to begin saving stories."
              : searchQuery || selectedCategory !== "All"
              ? "No stories matched your current search or category filter."
              : "No stories have been published yet. Be the first to leave a sweet memory or wish ✨"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {searchQuery || selectedCategory !== "All" ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                Reset Filters
              </button>
            ) : null}

            <Link
              href="/blog/write"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-mypink text-white text-xs md:text-sm font-medium shadow-sm shadow-pink-200 hover:bg-pink-400 transition-colors"
            >
              <PlusCircle size={14} />
              Write First Story
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Posts Grid */
        <div>
          {featuredPost && <BlogCard post={featuredPost} featured />}

          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 md:gap-8">
              {remainingPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Access */}
      <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-stone-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-mypink" />
          <span>A personal space of shared thoughts & wishes</span>
        </div>

        <Link
          href="/blog/write"
          className="text-stone-500 hover:text-mypink transition-colors flex items-center gap-1 font-medium bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-xs"
        >
          <Feather size={12} className="text-mypink" />
          Write a Story or Wish ✍️
        </Link>
      </div>
    </div>
  );
}
