"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  BookOpen,
  Lock,
} from "lucide-react";
import Link from "next/link";
import BlogAuthWrapper from "@/components/blog/BlogAuthWrapper";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { BlogPostItem } from "@/components/blog/BlogCard";

export default function AuthorDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Wishes");
  const [authorName, setAuthorName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // Check if current user has admin/author privileges
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/blog/auth/admin");
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAdmin(true);
          loadPosts();
        }
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/blog/posts?all=true");
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/blog/auth/admin", { method: "DELETE" });
      setIsAdmin(false);
      router.refresh();
    } catch {
      // Ignored
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("Wishes");
    setAuthorName("");
    setCoverImage("");
    setExcerpt("");
    setContent("");
    setPreviewMode(false);
  };

  const handleEdit = (post: BlogPostItem) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setAuthorName(post.authorName);
    setCoverImage(post.coverImage || "");
    setExcerpt(post.excerpt);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (publishStatus = true) => {
    if (!title.trim() || !content.trim()) {
      setMessage({ text: "Please provide a title and your message/story.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = {
      title,
      slug: slug.trim() || undefined,
      category,
      authorName: authorName.trim() || "A Friend",
      coverImage: coverImage.trim() || null,
      excerpt: excerpt.trim() || undefined,
      content,
      published: publishStatus,
    };

    try {
      const url = editingId ? `/api/blog/posts/${editingId}` : "/api/blog/posts";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          text: editingId ? "Story updated successfully!" : "Your story has been published to the journal! ✨",
          type: "success",
        });
        if (data.post?.slug) {
          setPublishedSlug(data.post.slug);
        }
        resetForm();
        if (isAdmin) loadPosts();
      } else {
        setMessage({ text: data.message || "Failed to save story.", type: "error" });
      }
    } catch {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostItem) => {
    try {
      const res = await fetch(`/api/blog/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        loadPosts();
      }
    } catch (err) {
      console.error("Error toggling publish state:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) resetForm();
        loadPosts();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <main className="min-h-screen bg-warm-cream/40 pt-10 sm:pt-16 pb-32 sm:pb-36 px-3.5 sm:px-6 md:px-8">
      <BlogAuthWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-stone-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-mypink/15 text-mypink flex items-center justify-center shadow-inner shrink-0">
                <Feather size={20} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-handwriting text-stone-800">
                  Write a Story or Wish ✍️
                </h1>
                <p className="text-[11px] sm:text-xs text-stone-500 font-sans">
                  Anyone can pen down a memory, birthday wish, or thought for Sharmila.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-xs font-medium text-stone-600 transition-colors shadow-xs"
              >
                <BookOpen size={13} /> Back to Journal
              </Link>

              {isAdmin && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors shadow-xs"
                >
                  <LogOut size={12} /> Logout
                </button>
              )}
            </div>
          </div>

          {/* Status / Success Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200 shadow-sm"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {message.type === "success" ? (
                    <CheckCircle size={18} className="text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {publishedSlug && (
                    <Link
                      href={`/blog/${publishedSlug}`}
                      className="px-3.5 py-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      View Story →
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMessage(null);
                      setPublishedSlug(null);
                    }}
                    className="text-stone-400 hover:text-stone-600 p-1"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Form Container */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-4 xs:p-6 md:p-10 shadow-xl border border-white/80 mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-5 sm:mb-6 pb-3.5 sm:pb-4 border-b border-stone-100">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-800 flex items-center gap-2">
                <FileText size={17} className="text-mypink" />
                <span>{editingId ? "Edit Story" : "Compose Your Story or Wish"}</span>
              </h2>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Author Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Your Name (Author) *
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Praveen, Sharmila, A Bestie..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800"
                  >
                    <option value="Wishes">Wishes 🎂</option>
                    <option value="Memories">Memories 📸</option>
                    <option value="Stories">Stories 📖</option>
                    <option value="Thoughts">Thoughts 💭</option>
                    <option value="Adventures">Adventures 🌍</option>
                  </select>
                </div>
              </div>

              {/* Title & Custom Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Story / Wish Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Happy Birthday to my favorite person ✨"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/photos/image.jpg or https://..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800"
                  />
                </div>
              </div>

              {/* Excerpt / Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Short Subtitle / Teaser (optional)
                </label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short one-line summary or sweet note..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800"
                />
              </div>

              {/* Content Editor with Preview Mode */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-600">
                    Your Story / Message (Markdown supported) *
                  </label>
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        !previewMode ? "bg-white text-stone-800 shadow-xs" : "text-stone-500"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        previewMode ? "bg-white text-stone-800 shadow-xs" : "text-stone-500"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {!previewMode ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="Write your heartfelt message here... You can use paragraphs, **bold**, *italic*, > quotes, and [links](url)..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-mypink/40 text-stone-800 leading-relaxed"
                  />
                ) : (
                  <div className="min-h-[200px] p-4 sm:p-6 bg-stone-50/50 rounded-xl sm:rounded-2xl border border-stone-200">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="text-stone-400 italic text-xs sm:text-sm">Write something to see a live preview here ✨</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-mypink hover:bg-pink-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-pink-200 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>{editingId ? "Update Story" : "Publish to Journal 💖"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Management Section (Visible if user is logged in as admin) */}
          {isAdmin && (
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-white/80">
              <h2 className="text-xl font-bold font-serif text-stone-800 mb-6">
                Story Management (Admin Mode - {posts.length})
              </h2>

              {loadingPosts ? (
                <div className="py-8 text-center text-xs text-stone-400">Loading stories...</div>
              ) : posts.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  No stories found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Author</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {posts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50">
                          <td className="py-3.5 font-medium pr-4">
                            <Link
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              className="hover:text-mypink transition-colors line-clamp-1"
                            >
                              {p.title}
                            </Link>
                          </td>
                          <td className="py-3.5 pr-4 text-stone-500">{p.authorName}</td>
                          <td className="py-3.5 pr-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-600">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <button
                              onClick={() => handleTogglePublish(p)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                                p.published
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              }`}
                            >
                              {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                              {p.published ? "Published" : "Draft"}
                            </button>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Guest / Admin Footer */}
          {!isAdmin && (
            <div className="mt-12 text-center">
              <Link
                href="/blog/write/login"
                className="text-[11px] text-stone-400 hover:text-stone-600 inline-flex items-center gap-1 transition-colors"
              >
                <Lock size={10} /> Admin Moderation Login
              </Link>
            </div>
          )}
        </div>
      </BlogAuthWrapper>
    </main>
  );
}
