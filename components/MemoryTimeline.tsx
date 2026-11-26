"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays, Pencil, Plus, Save, Trash2, X } from "lucide-react";

type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

const STORAGE_KEY = "sharmila-birthday-milestones-v1";

const placeholders: Milestone[] = [
  {
    id: "placeholder-1",
    date: "",
    title: "A moment worth keeping",
    description: "Replace this with the story behind a favourite memory.",
    image: "",
  },
  {
    id: "placeholder-2",
    date: "",
    title: "One of our favourite days",
    description: "Add what happened, why it mattered, and the little details you remember.",
    image: "",
  },
  {
    id: "placeholder-3",
    date: "",
    title: "A memory to come back to",
    description: "Write a personal note here and choose the photograph that belongs with it.",
    image: "",
  },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#C9BDB4] bg-[#FFFCF8] px-3 py-2.5 text-sm text-[#292D2B] outline-none transition focus:border-[#875365] focus:ring-2 focus:ring-[#875365]/15";

function makeId() {
  return `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function MemoryTimeline({ images }: { images: readonly string[] }) {
  const [milestones, setMilestones] = useState<Milestone[]>(placeholders);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setMilestones(parsed as Milestone[]);
      }
    } catch {
      // Keep the editable placeholder content if browser storage is unavailable.
    }
  }, []);

  function updateMilestone(id: string, patch: Partial<Milestone>) {
    setMilestones((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    setSaved(false);
  }

  function addMilestone() {
    setMilestones((current) => [
      ...current,
      {
        id: makeId(),
        date: "",
        title: "A new memory",
        description: "Add the story behind this moment.",
        image: "",
      },
    ]);
    setSaved(false);
  }

  function saveMilestones() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  function resetMilestones() {
    setMilestones(placeholders);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-28"
    >
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-t border-ink/20 pt-6">
        <div>
          <p className="text-sm font-semibold text-berry">Written by us, not by a camera roll</p>
          <h2 id="timeline-heading" className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            The little things we remember
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/75">
            A place for the dates, stories, and photographs that mean something.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-berry/40 px-5 py-2.5 text-sm font-semibold text-berry transition hover:bg-berry hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
          aria-expanded={editing}
        >
          {editing ? <X size={16} /> : <Pencil size={16} />}
          {editing ? "Close editor" : "Edit memories"}
        </button>
      </div>

      {editing && (
        <div className="mb-10 rounded-2xl border border-[#D9C9C3] bg-[#F8F2ED] p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-ink">Memory editor</h3>
              <p className="mt-1 text-xs leading-5 text-ink/65">
                These changes are saved in this browser only. Replace every example with your own details.
              </p>
            </div>
            <button type="button" onClick={addMilestone} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink">
              <Plus size={16} /> Add memory
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((item, index) => (
              <fieldset key={item.id} className="grid gap-3 rounded-xl border border-[#DDCEC7] bg-[#FFFCF8] p-4 sm:grid-cols-2">
                <legend className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-berry">
                  Memory {index + 1}
                </legend>
                <label className="text-xs font-semibold text-ink/75">
                  Date
                  <input type="date" value={item.date} onChange={(event) => updateMilestone(item.id, { date: event.target.value })} className={inputClass} />
                </label>
                <label className="text-xs font-semibold text-ink/75">
                  Title
                  <input value={item.title} onChange={(event) => updateMilestone(item.id, { title: event.target.value })} placeholder="Give this memory a name" className={inputClass} />
                </label>
                <label className="text-xs font-semibold text-ink/75 sm:col-span-2">
                  The story
                  <textarea value={item.description} onChange={(event) => updateMilestone(item.id, { description: event.target.value })} rows={3} placeholder="What happened? What do you want her to remember?" className={inputClass} />
                </label>
                <label className="text-xs font-semibold text-ink/75 sm:col-span-2">
                  Photograph
                  <select value={item.image} onChange={(event) => updateMilestone(item.id, { image: event.target.value })} className={inputClass}>
                    <option value="">No photograph selected</option>
                    {images.map((src) => <option key={src} value={src}>{src.split("/").pop()}</option>)}
                  </select>
                </label>
                <div className="flex items-center justify-between sm:col-span-2">
                  <span className="text-[11px] text-ink/50">You can leave the date or photo blank for now.</span>
                  <button type="button" onClick={() => { setMilestones((current) => current.filter((memory) => memory.id !== item.id)); setSaved(false); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#8B4350] transition hover:bg-[#F6E7E6]">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveMilestones} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-berry">
              <Save size={16} /> Save changes
            </button>
            <button type="button" onClick={resetMilestones} className="min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold text-ink/70 underline underline-offset-4 hover:text-berry">
              Restore placeholders
            </button>
            {saved && <span role="status" className="text-sm font-medium text-[#476B54]">Saved in this browser.</span>}
          </div>
        </div>
      )}

      {milestones.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {milestones.map((item, index) => (
            <article key={item.id} className="grid grid-cols-[5px_1fr] gap-4">
              <div className="rounded-full bg-rose/60" aria-hidden="true" />
              <div className="min-w-0">
                {item.image ? (
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-sage/20">
                    <Image src={`/${item.image.replace(/^\/+/, "")}`} alt={item.title || "Memory photograph"} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-rose/50 bg-[#F2ECE6] px-5 text-center">
                    <span className="font-display text-xl italic text-berry/70">Your photograph goes here</span>
                  </div>
                )}
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-berry">
                  <CalendarDays size={14} /> {item.date ? new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "Date to be added"}
                </p>
                <h3 className="font-display text-2xl leading-tight text-ink">{item.title || `Memory ${index + 1}`}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink/75">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="border-t border-ink/15 py-8 text-sm text-berry">No memories yet. Open the editor to add one.</p>
      )}
    </section>
  );
}
