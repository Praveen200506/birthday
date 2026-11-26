"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Camera,
  Feather,
  Gift,
  Heart,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface HeroSectionProps {
  images: string[];
}

interface PhotoFrameProps {
  src?: string;
  alt: string;
  caption: string;
  className: string;
  priority?: boolean;
  reduceMotion: boolean;
}

function PhotoFrame({
  src,
  alt,
  caption,
  className,
  priority = false,
  reduceMotion,
}: PhotoFrameProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.97 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={"group relative min-h-0 overflow-hidden rounded-[1.45rem] border border-white/80 bg-white p-2 shadow-[0_18px_55px_rgba(100,70,75,0.13)] sm:rounded-[1.8rem] sm:p-2.5 " + className}
    >
      <div className="relative h-full min-h-0 overflow-hidden rounded-[1rem] bg-gradient-to-br from-rose-100 via-amber-50 to-violet-100 sm:rounded-[1.35rem]">
        {src && !imageFailed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 48vw, (max-width: 1200px) 34vw, 420px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-rose-400/80">
            <Heart size={26} strokeWidth={1.3} />
            <span className="font-handwriting text-lg">A moment to keep</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-white/5" />
        <figcaption className="absolute bottom-3 left-3 right-3 font-handwriting text-lg text-white drop-shadow sm:bottom-4 sm:left-4 sm:text-xl">
          {caption}
        </figcaption>
      </div>
    </motion.figure>
  );
}

const storyCards = [
  {
    number: "01",
    title: "Moments",
    description: "Little snapshots, familiar smiles, and the kind of memories that deserve to stay close.",
    action: "Explore memories",
    href: "/memories",
    icon: Camera,
  },
  {
    number: "02",
    title: "Words",
    description: "A quiet page for heartfelt notes, kind thoughts, and words worth reading twice.",
    action: "Read the letter",
    href: "/letter",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Wishes",
    description: "A little celebration, a tiny surprise, and room for a wish to come true.",
    action: "Find the surprise",
    href: "/surprise",
    icon: Gift,
  },
];

export default function HeroSection({ images }: HeroSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <>
      <section
        id="home"
        className="hero-paper relative isolate flex min-h-[calc(100svh-5rem)] w-full items-center overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-rose-200/35 blur-3xl sm:h-96 sm:w-96"
            animate={reduceMotion ? undefined : { x: [0, 28, 0], y: [0, 18, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl sm:h-[28rem] sm:w-[28rem]"
            animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, -20, 0] }}
            transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-200/80 to-transparent" />
          <div className="absolute right-[8%] top-[16%] text-rose-300/70">
            <Sparkles size={24} strokeWidth={1.2} />
          </div>
          <div className="absolute bottom-[18%] left-[7%] text-amber-400/70">
            <Sparkles size={18} strokeWidth={1.2} />
          </div>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-10 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-500 shadow-sm backdrop-blur sm:text-xs">
              <Heart size={13} fill="currentColor" />
              A little birthday keepsake
            </div>

            <h1 className="font-handwriting text-[3.6rem] leading-[0.98] tracking-tight text-stone-800 sm:text-7xl md:text-[5.4rem]">
              Happy Birthday,
              <span className="mt-2 block bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text pb-2 text-transparent">
                Sharmila
              </span>
            </h1>

            <div className="mx-auto my-6 flex max-w-xs items-center justify-center gap-3 lg:mx-0 lg:justify-start">
              <span className="h-px w-12 bg-rose-200" />
              <Sparkles size={15} className="text-amber-400" />
              <span className="h-px w-12 bg-rose-200" />
            </div>

            <p className="mx-auto max-w-lg text-sm leading-7 text-stone-600 sm:text-base sm:leading-8 lg:mx-0">
              A little corner of the internet filled with moments, kind words, and wishes —
              made to celebrate you and the little things that make life lovely.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/memories"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-800 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(68,52,55,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-[0_16px_32px_rgba(244,114,132,0.25)] sm:w-auto"
              >
                Explore the memories
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/letter"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white/75 px-6 py-3 text-sm font-semibold text-stone-600 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-500 sm:w-auto"
              >
                <Feather size={15} />
                Read your letter
              </Link>
            </div>

            <div className="mt-9 flex items-center justify-center gap-3 text-left lg:justify-start">
              <div className="flex -space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fffaf7] bg-rose-100 text-rose-500">
                  <Heart size={13} fill="currentColor" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fffaf7] bg-amber-100 text-amber-600">
                  <Sparkles size={13} />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fffaf7] bg-violet-100 text-violet-500">
                  <Feather size={13} />
                </span>
              </div>
              <p className="text-[11px] leading-5 text-stone-400 sm:text-xs">
                Made of little things<br />
                <span className="font-semibold text-stone-500">and a whole lot of care.</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[620px]"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] border border-white/70 bg-white/25 shadow-[0_30px_90px_rgba(120,80,90,0.08)] backdrop-blur-sm sm:-inset-6 sm:rounded-[3rem]" />
            <div className="relative rounded-[2.1rem] border border-white/90 bg-[#fffdfb]/90 p-3 shadow-[0_25px_75px_rgba(105,75,80,0.14)] sm:rounded-[2.6rem] sm:p-5">
              <div className="mb-3 flex items-center justify-between px-1 sm:mb-4 sm:px-2">
                <div>
                  <p className="font-handwriting text-xl text-stone-700 sm:text-2xl">The little things</p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-rose-400 sm:text-[10px]">
                    A page from the scrapbook
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-400 sm:h-11 sm:w-11">
                  <Heart size={18} fill="currentColor" />
                </div>
              </div>

              <div className="grid aspect-[1.08/1] grid-cols-[1.06fr_0.94fr] grid-rows-3 gap-2.5 sm:gap-3.5">
                <PhotoFrame
                  src={images[0]}
                  alt="A photograph from the birthday memory collection"
                  caption="Keep this close"
                  className="row-span-3"
                  priority
                  reduceMotion={reduceMotion}
                />
                <PhotoFrame
                  src={images[1]}
                  alt="Another moment from the memory collection"
                  caption="Little joys"
                  className="row-span-1"
                  reduceMotion={reduceMotion}
                />
                <PhotoFrame
                  src={images[2]}
                  alt="A treasured moment from the photo collection"
                  caption="Sweet days"
                  className="row-span-1"
                  reduceMotion={reduceMotion}
                />
                <PhotoFrame
                  src={images[3]}
                  alt="A favorite photograph from the scrapbook"
                  caption="Always remember"
                  className="row-span-1"
                  reduceMotion={reduceMotion}
                />
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-rose-100 px-1 pt-3 sm:mt-4 sm:px-2 sm:pt-4">
                <span className="font-handwriting text-base text-stone-500 sm:text-lg">A collection made with care</span>
                <span className="text-xs tracking-[0.3em] text-rose-300">✦ ♥ ✦</span>
              </div>
            </div>

            <motion.div
              animate={reduceMotion ? undefined : { rotate: [-5, -2, -5], y: [0, -4, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 -top-5 rounded-xl border border-amber-100 bg-[#fff5d9] px-3 py-2 text-center shadow-lg sm:-right-5 sm:top-2 sm:px-4"
            >
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700">Just for you</span>
              <span className="font-handwriting text-lg text-amber-800 sm:text-xl">with love ♡</span>
            </motion.div>
          </motion.div>
        </div>

        <a
          href="#about"
          className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-[0.24em] text-stone-400 transition hover:text-rose-500"
        >
          A little more
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={15} />
          </motion.span>
        </a>
      </section>

      <section id="about" className="relative overflow-hidden bg-[#fffaf7] px-5 py-20 sm:px-8 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-rose-100/70 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75 }}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-500 shadow-sm">
              <Sparkles size={13} />
              A note about this place
            </span>
            <h2 className="mt-5 font-handwriting text-4xl leading-tight text-stone-800 sm:text-6xl">
              More than a website,
              <span className="block text-rose-400">a little keepsake.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-500 sm:text-base sm:leading-8">
              This little corner was made to gather the moments that deserve a second look,
              the words that are worth keeping, and a few surprises along the way.
              Take your time, wander through the pages, and make yourself at home.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {storyCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.12, duration: 0.65 }}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  className="group rounded-[1.8rem] border border-white bg-white/85 p-6 shadow-[0_12px_40px_rgba(100,70,75,0.07)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_22px_50px_rgba(100,70,75,0.12)] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-handwriting text-2xl text-rose-200">{card.number}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-400 transition duration-300 group-hover:rotate-[-7deg] group-hover:scale-110">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                  </div>
                  <h3 className="mt-6 font-handwriting text-3xl text-stone-800">{card.title}</h3>
                  <p className="mt-3 min-h-[76px] text-sm leading-7 text-stone-500">{card.description}</p>
                  <Link
                    href={card.href}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-rose-500 transition-colors hover:text-rose-700"
                  >
                    {card.action}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.8rem] border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-violet-50 px-6 py-6 text-center sm:mt-12 sm:flex-row sm:px-9 sm:text-left"
          >
            <div>
              <p className="font-handwriting text-2xl text-stone-700 sm:text-3xl">There is a little more to discover.</p>
              <p className="mt-1 text-xs text-stone-500 sm:text-sm">A journal, a surprise, and a few lovely details await.</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-rose-500 shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
            >
              Visit the journal
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="mt-12 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-300 sm:mt-16">
            <span className="h-px w-10 bg-rose-200" />
            Made with care, just for you
            <span className="h-px w-10 bg-rose-200" />
          </div>
        </div>
      </section>
    </>
  );
}
