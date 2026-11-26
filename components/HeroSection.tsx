"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MemoryTimeline from "@/components/MemoryTimeline";
import { birthdayConfig as config } from "@/data/birthdayConfig";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Camera, Heart, Sparkles, X } from "lucide-react";

interface HeroSectionProps { images: readonly string[]; }
const photoMats = ["bg-[#D8E0D8] border-[#A8B8AA]", "bg-[#E5D7D3] border-[#C9AAA5]", "bg-[#D7DFE4] border-[#A9BAC6]", "bg-[#E8DFC9] border-[#C9B994]"];

export default function HeroSection({ images }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const person = config.person;
  const hero = config.hero;
  return (
    <div className="relative min-h-screen overflow-hidden text-ink">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="birthday-drift absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#F3A5A2]/35 blur-3xl" />
        <span className="birthday-drift absolute right-[7%] top-10 h-72 w-72 rounded-full bg-[#F7C77D]/35 blur-3xl" />
        <span className="birthday-twinkle absolute left-[48%] top-24 h-3 w-3 rotate-45 bg-[#D65A7D]/70" />
        <span className="birthday-twinkle absolute right-[18%] top-[72%] h-3 w-3 rotate-45 bg-[#C18B45]/80" />
      </div>

      <motion.section id="home" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto grid min-h-[min(850px,92svh)] w-full max-w-[1720px] items-center gap-7 px-5 pb-14 pt-12 sm:px-9 lg:grid-cols-[minmax(330px,0.82fr)_minmax(470px,1.2fr)_minmax(170px,0.38fr)] lg:gap-8 lg:px-12 lg:py-12 xl:gap-12 xl:px-16">
        <div className="relative z-10 flex flex-col items-start justify-center lg:py-12">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D99BA7] bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-berry">
            <Sparkles size={14} /> {person.eyebrow}
          </p>
          <h1 className="max-w-[680px] font-display text-[clamp(3.5rem,6.3vw,7.4rem)] leading-[0.91] tracking-[-0.055em]">{person.greeting}</h1>
          <p className="mt-7 max-w-[34rem] text-base leading-8 text-ink/85 sm:text-lg">{person.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#photographs" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-berry px-6 py-3 text-sm font-bold text-white shadow-lg shadow-berry/20 transition hover:-translate-y-1 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry">
              {hero.photoCta} <ArrowDown size={16}/>
            </a>
            <Link href="/letter" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-berry/40 bg-white/65 px-5 py-3 text-sm font-bold text-berry transition hover:bg-white">
              {hero.letterCta} <ArrowUpRight size={15}/>
            </Link>
          </div>
          <p className="mt-9 max-w-sm border-l-2 border-rose pl-4 font-display text-xl italic leading-snug text-berry sm:text-2xl">{person.signature}</p>
        </div>

        <motion.button type="button" onClick={() => images.length && setSelectedPhoto(0)} aria-label="Open the featured birthday photograph"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: 1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }} whileHover={reduceMotion ? undefined : { y: -7, rotate: -0.6 }}
          className="group relative mx-auto block w-full max-w-[850px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-berry">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#E9B85E]/35 via-[#E98591]/25 to-[#AFC8B5]/35 blur-xl"/>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-[10px] border-[#FFF9F4] bg-[#E8EAE3] shadow-[0_30px_90px_rgba(73,42,54,0.20)] sm:aspect-[5/4] lg:aspect-[4/5]">
            {images[0] ? <Image src={images[0]} alt="A favourite photograph of Sharmila" fill priority sizes="(max-width: 1024px) 92vw, 52vw" className="object-contain p-1 transition-transform duration-700 group-hover:scale-[1.025]"/> : <div className="flex h-full items-center justify-center text-berry">Add a favourite photograph</div>}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/70 bg-[#FFF9F4]/90 px-4 py-3 shadow-lg backdrop-blur-md">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-berry">{hero.photoLabel}</p><p className="mt-0.5 font-display text-lg text-ink">{hero.photoModalLabel}</p></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-berry text-white"><Camera size={18}/></span>
            </div>
          </div>
        </motion.button>

        <aside className="relative hidden h-full flex-col justify-center gap-5 lg:flex">
          <div className="rounded-[1.7rem] border border-white/80 bg-white/70 p-5 shadow-[0_16px_45px_rgba(73,42,54,0.08)] backdrop-blur-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9E2E3] text-berry"><Heart size={18} fill="currentColor"/></span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-berry">{hero.sideNoteTitle}</p>
            <p className="mt-2 font-display text-xl leading-snug text-ink">{hero.sideNote}</p>
          </div>
          <div className="rounded-[1.7rem] bg-[#8B294B] p-5 text-white shadow-xl shadow-berry/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">The collection</p>
            <p className="mt-2 font-display text-5xl">{images.length.toString().padStart(2,"0")}</p>
            <p className="mt-1 text-xs text-white/80">photographs and counting</p>
          </div>
          <a href="#timeline" className="group flex items-center justify-between rounded-2xl border border-berry/20 bg-white/65 px-4 py-3 text-sm font-bold text-berry transition hover:bg-white">
            {hero.timelineCta} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
          </a>
        </aside>
      </motion.section>

      <MemoryTimeline />

      <section id="photographs" aria-labelledby="photographs-heading" className="relative z-10 mx-auto w-full max-w-[1720px] scroll-mt-8 px-5 pb-36 sm:px-9 lg:px-16">
        <div className="mb-8 flex flex-col justify-between gap-4 border-t border-ink/20 pt-6 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold text-berry">{hero.galleryLabel}</p><h2 id="photographs-heading" className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-6xl">Every little frame.</h2></div>
          <p className="max-w-md text-sm leading-6 text-ink/75">{hero.galleryDescription}</p>
        </div>
        {images.length > 0 ? <div className="columns-2 gap-4 sm:columns-3 sm:gap-5 lg:columns-4 xl:columns-5">
          {images.map((src,index) => {
            const ratio = index % 5 === 0 ? "aspect-[5/4]" : index % 4 === 2 ? "aspect-[3/4]" : "aspect-[4/5]";
            return <figure key={src} className={`group mb-4 break-inside-avoid overflow-hidden rounded-[1.2rem] border p-2 shadow-[0_8px_24px_rgba(41,53,50,0.09)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(41,53,50,0.16)] ${photoMats[index%photoMats.length]}`}>
              <button type="button" onClick={() => setSelectedPhoto(index)} aria-label={`Open photograph ${index+1}`} className={`relative block w-full overflow-hidden rounded-[0.8rem] bg-[#F0F1EC] ${ratio} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry`}>
                <Image src={src} alt={`Photo ${index+1} from the birthday collection`} fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 20vw" className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.025]"/>
              </button>
            </figure>;
          })}
        </div> : <p className="border-t border-ink/20 py-8 text-sm text-berry">No photographs are available yet.</p>}
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/20 pt-6 text-sm">
          <Link className="font-bold text-berry underline decoration-rose underline-offset-4" href="/memories">More memories</Link>
          <Link className="font-bold text-berry underline decoration-rose underline-offset-4" href="/surprise">A birthday surprise</Link>
          <Link className="font-bold text-berry underline decoration-rose underline-offset-4" href="/blog">The journal</Link>
        </div>
      </section>

      {selectedPhoto !== null && images[selectedPhoto] && <div role="dialog" aria-modal="true" aria-label="Photograph viewer" className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24151D]/95 p-4 backdrop-blur-md" onClick={() => setSelectedPhoto(null)}>
        <button type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close photograph" className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-berry shadow-lg"><X/></button>
        <button type="button" aria-label="Previous photograph" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + images.length) % images.length); }} className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-berry shadow-lg">‹</button>
        <div className="relative h-[82vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
          <Image src={images[selectedPhoto]} alt={`Birthday photograph ${selectedPhoto+1}`} fill sizes="90vw" className="object-contain"/>
          <p className="absolute bottom-[-2rem] left-0 right-0 text-center text-sm text-white/80">{selectedPhoto+1} / {images.length}</p>
        </div>
        <button type="button" aria-label="Next photograph" onClick={(event) => { event.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % images.length); }} className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-berry shadow-lg">›</button>
      </div>}
    </div>
  );
}
