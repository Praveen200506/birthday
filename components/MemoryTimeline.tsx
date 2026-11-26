"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { birthdayConfig } from "@/data/birthdayConfig";

type SavedMemory = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
};

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string;
};

const timelineItems: TimelineItem[] = birthdayConfig.timeline.placeholders.map((item) => ({ ...item }));

function memoryNumber(title: string) {
  const match = title.trim().match(/^memory[-\s]*(\d+)$/i);
  return match ? Number(match[1]) : null;
}

export default function MemoryTimeline() {
  const [uploadedMemories, setUploadedMemories] = useState<SavedMemory[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/memories", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load memories");
        if (!cancelled) setUploadedMemories(Array.isArray(data.memories) ? data.memories : []);
      })
      .catch((error) => {
        console.error("Could not load timeline photographs:", error);
      });
    return () => { cancelled = true; };
  }, []);

  const memoriesByNumber = new Map<number, SavedMemory>();
  for (const memory of uploadedMemories) {
    const number = memoryNumber(memory.title);
    if (number !== null && !memoriesByNumber.has(number)) memoriesByNumber.set(number, memory);
  }

  return (
    <section id="timeline" aria-labelledby="timeline-heading" className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28">
      <div className="mb-9 border-t border-[#9B3D5B]/25 pt-6">
        <p className="text-sm font-bold text-[#A43F60]">A few dates worth remembering</p>
        <h2 id="timeline-heading" className="mt-2 font-display text-4xl leading-tight tracking-tight text-[#38252E] sm:text-5xl">{birthdayConfig.timeline.heading}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#59434A]">{birthdayConfig.timeline.intro}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {timelineItems.map((item, index) => {
          const number = memoryNumber(item.title);
          const photo = number === null ? undefined : memoriesByNumber.get(number);
          return (
            <article key={item.id} className="group grid grid-cols-[5px_1fr] gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-full bg-gradient-to-b from-[#E96D87] via-[#C94C70] to-[#F0B16E]" aria-hidden="true" />
              <div className="min-w-0">
                {photo?.imageUrl ? (
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl border border-[#E6B9B2] bg-[#FFF7F1] shadow-[0_8px_24px_rgba(126,53,74,0.10)]">
                    <Image unoptimized src={photo.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.015]" />
                  </div>
                ) : (
                  <div className="mb-4 flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-[#D9959D] bg-[#FFF0E9] px-5 text-center">
                    <span className="font-display text-xl italic text-[#A34D67]">{item.title}</span>
                  </div>
                )}
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A43F60]">
                  <CalendarDays size={14} /> {new Date(item.date + "T12:00:00").toLocaleDateString("en", { month: "long", year: "numeric" })}
                </p>
                <h3 className="font-display text-2xl leading-tight text-[#38252E]">{item.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#59434A]">{photo?.caption || item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
