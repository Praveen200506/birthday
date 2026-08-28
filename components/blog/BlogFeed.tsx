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
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-mypink/20 shadow-sm text-xs md:text-sm text-mypink font-medium mb-4">
          <Feather size={14} />
          <span>A Little Corner For Things I Want To Share</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-handwriting text-stone-800 mb-3 tracking-wide">
          Our Little Stories & Journal
        </h1>
        <p className="text-stone-500 font-sans text-sm md:text-base max-w-lg mx-auto font-light">
          stories • thoughts • memories • little reflections
        </p>
      </motion.div>

      {/* Filter & Search Bar */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-mypink text-white shadow-md shadow-pink-200"
                  : "bg-white/80 text-stone-600 hover:bg-white border border-stone-200/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Write & Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full bg-white/80 backdrop-blur-sm border border-stone-200/70 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-700 placeholder:text-stone-400"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          <Link
            href="/blog/write"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mypink hover:bg-pink-400 text-white text-xs md:text-sm font-semibold shadow-md shadow-pink-200 transition-all shrink-0"
          >
            <Feather size={14} />
            <span>Write Story</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-mypink border-t-transparent rounded-full"
          />
          <p className="text-xs text-stone-400 font-handwriting text-lg">
            Opening the journal pages...
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 md:p-14 text-center max-w-xl mx-auto shadow-lg border border-white/60 my-8"
        >
          <div className="w-16 h-16 rounded-full bg-mypink/10 text-mypink flex items-center justify-center mx-auto mb-4 text-2xl">
            📖
          </div>
          <h3 className="text-2xl md:text-3xl font-handwriting text-stone-800 mb-2">
            No Stories Found
          </h3>
          <p className="text-stone-500 text-xs md:text-sm mb-6 max-w-md mx-auto leading-relaxed">
            {!dbConfigured
              ? "The journal is ready! Configure the database in the environment to begin saving stories."
              : searchQuery || selectedCategory !== "All"
              ? "No stories matched your current search or category filter."
              : "No stories have been published yet. Be the first to leave a sweet memory or wish ✨"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {searchQuery || selectedCategory !== "All" ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                Reset Filters
              </button>
            ) : null}

            <Link
              href="/blog/write"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mypink text-white text-xs md:text-sm font-medium shadow-md shadow-pink-200 hover:bg-pink-400 transition-colors"
            >
              <PlusCircle size={15} />
              Write First Story
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Posts Grid */
        <div>
          {featuredPost && <BlogCard post={featuredPost} featured />}

          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {remainingPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Access */}
      <div className="mt-16 pt-8 border-t border-stone-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-mypink" />
          <span>A personal space of shared thoughts & wishes</span>
        </div>

        <Link
          href="/blog/write"
          className="text-stone-500 hover:text-mypink transition-colors flex items-center gap-1 font-medium bg-white px-4 py-1.5 rounded-full border border-stone-200 shadow-sm"
        >
          <Feather size={12} className="text-mypink" />
          Write a Story or Wish ✍️
        </Link>
      </div>
    </div>
  );
}
