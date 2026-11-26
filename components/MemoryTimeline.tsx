"use client";

import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { CalendarDays, ImagePlus, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { birthdayConfig } from "@/data/birthdayConfig";

type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

const STORAGE_KEY = "sharmila-birthday-milestones-v1";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
type SavedMemory = { id: string; title: string; caption: string; imageUrl: string; createdAt: string };
const placeholders: Milestone[] = birthdayConfig.timeline.placeholders.map((item) => ({ ...item }));
const inputClass = "mt-1.5 w-full rounded-xl border border-[#D8B8B4] bg-white px-3 py-2.5 text-sm text-[#38252E] outline-none transition focus:border-[#9B3D5B] focus:ring-2 focus:ring-[#9B3D5B]/20";

function makeId() {
  return "memory-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export default function MemoryTimeline({ images }: { images: readonly string[] }) {
  const [milestones, setMilestones] = useState<Milestone[]>(placeholders);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedMemories, setUploadedMemories] = useState<SavedMemory[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/memories", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load uploaded memories.");
        if (!cancelled) setUploadedMemories(Array.isArray(data.memories) ? data.memories : []);
      })
      .catch(() => {
        if (!cancelled) setUploadMessage("Saved gallery photos are temporarily unavailable. You can still upload a new photo.");
      });

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setMilestones(parsed as Milestone[]);
      }
    } catch {
      // Keep the editable placeholder content if browser storage is unavailable.
    }
    return () => { cancelled = true; };
  }, []);

  function updateMilestone(id: string, patch: Partial<Milestone>) {
    setMilestones((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
    setSaved(false);
  }

  function addMilestone() {
    setMilestones((current) => [...current, {
      id: makeId(), date: "", title: "A new memory",
      description: "Add the story behind this moment.", image: "",
    }]);
    setSaved(false);
  }

  async function uploadPhoto(id: string, file: File) {
    setUploadMessage("");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadMessage("Choose a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      setUploadMessage("The image must be smaller than 15 MB.");
      return;
    }

    const milestone = milestones.find((item) => item.id === id);
    if (!milestone) {
      setUploadMessage("This memory could not be found. Please close and reopen the editor.");
      return;
    }

    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("title", milestone.title.trim() || "A birthday memory");
      formData.set("caption", milestone.description.trim());
      const response = await fetch("/api/memories/upload", {
        method: "POST",
        body: formData,
      });
      const saveData = await response.json();
      if (!response.ok || !saveData.success || !saveData.memory?.imageUrl) {
        throw new Error(saveData.message || "Photo upload failed. Please try again.");
      }

      const savedMemory = saveData.memory as SavedMemory;
      setUploadedMemories((current) => [savedMemory, ...current.filter((memory) => memory.id !== savedMemory.id)]);
      updateMilestone(id, { image: savedMemory.imageUrl });
      setUploadMessage("Photo uploaded and saved to Memories. Save changes to attach it to this timeline milestone.");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Photo upload failed. Please try again.");
    } finally {
      setUploadingId(null);
    }
  }

  function saveMilestones() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
      setSaved(true);
      setUploadMessage("Your memories are saved in this browser.");
    } catch {
      setSaved(false);
      setUploadMessage("Could not save in this browser. Check available storage.");
    }
  }

  function resetMilestones() {
    setMilestones(placeholders);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
    setUploadMessage("");
  }

  return (
    <section id="timeline" aria-labelledby="timeline-heading" className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-t border-[#9B3D5B]/25 pt-6">
        <div>
          <p className="text-sm font-bold text-[#A43F60]">Written by us, not by a camera roll</p>
          <h2 id="timeline-heading" className="mt-2 font-display text-4xl leading-tight tracking-tight text-[#38252E] sm:text-5xl">{birthdayConfig.timeline.heading}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#59434A]">{birthdayConfig.timeline.intro}</p>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)} aria-expanded={editing}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#9B3D5B] bg-white px-5 py-2.5 text-sm font-bold text-[#8B294B] shadow-sm transition hover:bg-[#8B294B] hover:text-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]">
          {editing ? <X size={16} /> : <Pencil size={16} />}
          {editing ? "Close editor" : birthdayConfig.timeline.editLabel}
        </button>
      </div>

      {editing && (
        <div className="mb-10 rounded-2xl border-2 border-[#E7B7B4] bg-[#FFF8F4] p-4 shadow-[0_14px_40px_rgba(126,53,74,0.10)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-[#38252E]">Memory editor</h3>
              <p className="mt-1 text-xs leading-5 text-[#684E55]">Add a real photo from your device, or choose one already on the page.</p>
            </div>
            <button type="button" onClick={addMilestone} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#8B294B] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#542638] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#8B294B]">
              <Plus size={16} /> Add memory
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((item, index) => (
              <fieldset key={item.id} className="grid gap-3 rounded-xl border border-[#E5C9C2] bg-white p-4 shadow-sm sm:grid-cols-2">
                <legend className="px-1 text-xs font-bold uppercase tracking-[0.12em] text-[#963D5A]">Memory {index + 1}</legend>
                <label className="text-xs font-bold text-[#59434A]">Date
                  <input type="date" value={item.date} onChange={(event) => updateMilestone(item.id, { date: event.target.value })} className={inputClass} />
                </label>
                <label className="text-xs font-bold text-[#59434A]">Title
                  <input value={item.title} onChange={(event) => updateMilestone(item.id, { title: event.target.value })} placeholder="Give this memory a name" className={inputClass} />
                </label>
                <label className="text-xs font-bold text-[#59434A] sm:col-span-2">The story
                  <textarea value={item.description} onChange={(event) => updateMilestone(item.id, { description: event.target.value })} rows={3} placeholder="What happened? What do you want her to remember?" className={inputClass} />
                </label>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#59434A]">Choose an existing photograph
                    <select value={item.image} onChange={(event) => updateMilestone(item.id, { image: event.target.value })} className={inputClass}>
                      <option value="">Use an uploaded photo / no existing photo</option>
                      {uploadedMemories.map((memory) => <option key={memory.id} value={memory.imageUrl}>{memory.title || "Uploaded memory"}</option>)}
                      {images.map((src) => <option key={src} value={src}>{src.split("/").pop()}</option>)}
                    </select>
                  </label>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-[#8B294B] bg-[#FFF0EA] px-4 py-2 text-sm font-bold text-[#8B294B] transition hover:bg-[#8B294B] hover:text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-[#8B294B]">
                      {uploadingId === item.id ? <LoaderCircle size={17} className="animate-spin" /> : <ImagePlus size={17} />}
                      {uploadingId === item.id ? "Uploading photo…" : "Upload from device"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={uploadingId !== null} onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) void uploadPhoto(item.id, file);
                        event.currentTarget.value = "";
                      }} />
                    </label>
                    <span className="text-xs text-[#745C62]">JPG, PNG, WebP or GIF · up to 15 MB</span>
                  </div>
                  {item.image && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#FFF5F0] p-2">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F4E5DF]">
                        <Image src={item.image.startsWith("http") ? item.image : "/" + item.image.replace(/^\/+/, "")} alt="Selected memory preview" fill sizes="80px" className="object-contain" />
                      </div>
                      <span className="min-w-0 break-all text-xs text-[#59434A]">{item.image.split("/").pop()}</span>
                      <button type="button" onClick={() => updateMilestone(item.id, { image: "" })} className="ml-auto inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[#8B294B] hover:bg-[#F9E2E1]" aria-label="Remove selected photo"><X size={14} /> Remove</button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <span className="text-[11px] text-[#745C62]">Date is optional; you can edit this later.</span>
                  <button type="button" onClick={() => { setMilestones((current) => current.filter((memory) => memory.id !== item.id)); setSaved(false); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#A12F4D] transition hover:bg-[#FCE9E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B294B]">
                    <Trash2 size={14} /> Remove memory
                  </button>
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveMilestones} disabled={uploadingId !== null} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#542638] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#8B294B] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#8B294B]">
              <Save size={16} /> Save changes
            </button>
            <button type="button" onClick={resetMilestones} className="min-h-11 rounded-full border border-[#A45C70] bg-white px-4 py-2.5 text-sm font-bold text-[#8B294B] transition hover:bg-[#FCE9E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#8B294B]">Restore placeholders</button>
            {saved && <span role="status" className="text-sm font-bold text-[#356447]">Saved in this browser.</span>}
          </div>
          {uploadMessage && <p role="status" aria-live="polite" className="mt-3 text-sm font-semibold text-[#8B294B]">{uploadMessage}</p>}
        </div>
      )}

      {milestones.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {milestones.map((item, index) => (
            <article key={item.id} className="group grid grid-cols-[5px_1fr] gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-full bg-gradient-to-b from-[#E96D87] via-[#C94C70] to-[#F0B16E]" aria-hidden="true" />
              <div className="min-w-0">
                {item.image ? (
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-[#E6B9B2] bg-[#FFF7F1] shadow-[0_8px_24px_rgba(126,53,74,0.10)]">
                    <Image src={item.image.startsWith("http") ? item.image : "/" + item.image.replace(/^\/+/, "")} alt={item.title || "Memory photograph"} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                ) : (
                  <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-[#D9959D] bg-[#FFF0E9] px-5 text-center">
                    <span className="font-display text-xl italic text-[#A34D67]">Your photograph goes here</span>
                  </div>
                )}
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A43F60]">
                  <CalendarDays size={14} /> {item.date ? new Date(item.date + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "Date to be added"}
                </p>
                <h3 className="font-display text-2xl leading-tight text-[#38252E]">{item.title || "Memory " + (index + 1)}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#59434A]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="border-t border-[#9B3D5B]/20 py-8 text-sm text-[#8B294B]">No memories yet. Open the editor to add one.</p>
      )}
    </section>
  );
}
