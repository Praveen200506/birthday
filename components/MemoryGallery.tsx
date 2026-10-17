"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ImagePlus,
  Images,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Shuffle,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Memory {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
}

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function MemoryGallery() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [shuffledMemories, setShuffledMemories] = useState<Memory[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMemories() {
      try {
        const response = await fetch("/api/memories", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load memories.");
        }
        if (!cancelled) setMemories(Array.isArray(data.memories) ? data.memories : []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load memories.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function checkAuthorSession() {
      try {
        const response = await fetch("/api/blog/auth/admin", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled) setIsAdmin(Boolean(response.ok && data.authenticated));
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    }

    void loadMemories();
    void checkAuthorSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setShuffledMemories(memories);
    setRotations(memories.map(() => Math.random() * 8 - 4));
  }, [memories]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const closeComposer = useCallback(() => {
    setShowUploader(false);
    setError(null);
    setTitle("");
    setCaption("");
    setFile(null);
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!isAdmin) {
      setError("Sign in through the author portal before adding memories.");
      return;
    }
    if (!title.trim()) {
      setError("Give this memory a title.");
      return;
    }
    if (!file) {
      setError("Choose an image to upload.");
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
      setError("Choose an image smaller than 8 MB.");
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase public URL and anon key are missing from the app environment.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const signedResponse = await fetch("/api/memories/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      const signedData = await signedResponse.json();
      if (!signedResponse.ok || !signedData.success) {
        throw new Error(signedData.message || "Could not prepare the image upload.");
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      const { error: uploadError } = await supabase.storage
        .from(signedData.bucket)
        .uploadToSignedUrl(signedData.path, signedData.token, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error("Supabase upload failed: " + uploadError.message);
      }

      const saveResponse = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          caption: caption.trim(),
          storagePath: signedData.path,
        }),
      });
      const saveData = await saveResponse.json();
      if (!saveResponse.ok || !saveData.success) {
        throw new Error(saveData.message || "The image uploaded, but the memory could not be saved.");
      }

      setMemories((current) => [saveData.memory, ...current]);
      closeComposer();
      setNotice("Your new memory has been added. ❤️");
    } catch (uploadFailure) {
      setError(uploadFailure instanceof Error ? uploadFailure.message : "Could not upload this memory.");
    } finally {
      setSubmitting(false);
    }
  };

  const shuffleImages = () => {
    setShuffledMemories((current) => [...current].sort(() => Math.random() - 0.5));
  };

  return (
    <section className="min-h-screen overflow-x-hidden bg-warm-cream/30 px-3 pb-28 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mx-auto mb-8 max-w-3xl text-center sm:mb-12"
      >
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs text-mypink shadow-sm">
          <Sparkles size={14} /> Little things, forever memories
        </p>
        <h1 className="mb-3 text-4xl font-handwriting text-stone-800 sm:text-6xl">
          Our Little Universe
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
          A growing collection of moments worth keeping. Every new memory is saved and will be here the next time you visit.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {shuffledMemories.length > 1 && (
            <button
              type="button"
              onClick={shuffleImages}
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-5 py-3 text-sm text-stone-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Shuffle size={16} /> Shuffle memories
            </button>
          )}

          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setNotice(null);
                setShowUploader((current) => !current);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-mypink px-5 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-400"
            >
              {showUploader ? <X size={16} /> : <Plus size={17} />}
              {showUploader ? "Close uploader" : "Add a memory"}
            </button>
          ) : !authChecking ? (
            <Link
              href="/blog/write/login"
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-5 py-3 text-sm text-stone-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <LockKeyhole size={16} /> Author login to add memories
            </Link>
          ) : null}
        </div>
      </motion.header>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence>
          {showUploader && isAdmin && (
            <motion.form
              onSubmit={handleUpload}
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-10 overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl backdrop-blur-xl sm:p-8"
            >
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-mypink">
                  <ImagePlus size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-handwriting text-stone-800 sm:text-2xl">Save a new memory</h2>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    The photo goes straight to your Supabase Storage bucket. Its title and caption are saved in PostgreSQL.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="memory-title" className="mb-1.5 block text-xs font-semibold text-stone-600">
                    Memory title *
                  </label>
                  <input
                    id="memory-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    required
                    placeholder="A day to remember"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label htmlFor="memory-caption" className="mb-1.5 block text-xs font-semibold text-stone-600">
                    Caption (optional)
                  </label>
                  <textarea
                    id="memory-caption"
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Add a little story behind this photo..."
                    className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-800 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label htmlFor="memory-image" className="mb-1.5 block text-xs font-semibold text-stone-600">
                    Memory image * <span className="font-normal text-stone-400">(JPG, PNG, WebP or GIF; up to 8 MB)</span>
                  </label>
                  <input
                    id="memory-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                    onChange={(event) => {
                      const nextFile = event.target.files?.[0] || null;
                      setFile(nextFile);
                      setError(null);
                    }}
                    className="block w-full cursor-pointer rounded-xl border border-dashed border-pink-200 bg-pink-50/40 p-3 text-xs text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-pink-500"
                  />
                  {previewUrl && (
                    <div className="mt-4 flex items-center gap-4 rounded-2xl bg-stone-50 p-3">
                      <img src={previewUrl} alt="Preview of the selected memory" className="h-24 w-24 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-700">{file?.name}</p>
                        <p className="mt-1 text-xs text-stone-400">{((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={closeComposer}
                  disabled={submitting}
                  className="rounded-full px-5 py-2.5 text-sm text-stone-500 transition hover:bg-stone-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-mypink px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-100 transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
                  {submitting ? "Uploading..." : "Save memory"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {notice && (
          <p role="status" className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle size={17} /> {notice}
          </p>
        )}

        {error && !showUploader && (
          <p role="alert" className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={17} /> {error}
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss error" className="ml-2 rounded-full p-1 hover:bg-red-100">
              <X size={15} />
            </button>
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-stone-400">
          <LoaderCircle size={20} className="animate-spin text-mypink" /> Gathering your memories...
        </div>
      ) : shuffledMemories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-white/80 bg-white/60 px-6 py-14 text-center shadow-sm"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-mypink">
            <Images size={28} />
          </div>
          <h2 className="mb-2 text-2xl font-handwriting text-stone-700">A fresh page for new memories</h2>
          <p className="max-w-sm text-sm leading-6 text-stone-500">
            No memories have been added yet. Once you upload the first photo, it will appear here and stay saved for future visits.
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-mypink px-5 py-3 text-sm font-semibold text-white shadow-md shadow-pink-100 transition hover:bg-pink-400"
            >
              <Plus size={17} /> Add the first memory
            </button>
          )}
        </motion.div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 pb-12 sm:gap-8">
          {shuffledMemories.map((memory, index) => (
            <motion.button
              key={memory.id}
              type="button"
              layoutId={"memory-" + memory.id}
              onClick={() => setSelectedMemory(memory)}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1, rotate: rotations[index] || 0 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-[calc(50%-0.5rem)] max-w-[280px] cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 xs:w-[165px] sm:w-[240px] md:w-[280px]"
              aria-label={"Open memory: " + memory.title}
            >
              <div className="relative h-full rounded-sm bg-white p-2 pb-4 shadow-md transition-shadow duration-300 group-hover:shadow-xl sm:p-3 sm:pb-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-stone-100">
                  <Image
                    src={memory.imageUrl}
                    alt={memory.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 240px, 280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-1 pt-3">
                  <p className="line-clamp-1 font-handwriting text-base text-stone-700 sm:text-xl">{memory.title}</p>
                  {memory.caption && (
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-stone-400 sm:text-xs">{memory.caption}</p>
                  )}
                </div>
              </div>
              <span className="pointer-events-none absolute -right-1.5 -top-1.5 rounded-full border-2 border-white bg-pink-200 px-2 py-1 text-[9px] text-pink-700 shadow-sm">
                ♥
              </span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedMemory.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              layoutId={"memory-" + selectedMemory.id}
              className="relative w-full max-w-4xl rounded-3xl bg-white/95 p-4 shadow-2xl sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedMemory(null)}
                aria-label="Close memory"
                className="absolute right-3 top-3 z-10 rounded-full bg-stone-900/70 p-2 text-white transition hover:bg-stone-900"
              >
                <X size={20} />
              </button>
              <div className="relative mx-auto max-h-[68vh] min-h-48 w-full overflow-hidden rounded-2xl bg-stone-100 sm:max-h-[72vh]">
                <Image
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="mx-auto max-h-[68vh] w-auto max-w-full object-contain sm:max-h-[72vh]"
                />
              </div>
              <h2 className="mt-5 text-center font-handwriting text-2xl text-stone-800 sm:text-3xl">{selectedMemory.title}</h2>
              {selectedMemory.caption && (
                <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-6 text-stone-500">{selectedMemory.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
