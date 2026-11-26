"use client";

import Image from "next/image";
import Link from "next/link";
import MemoryTimeline from "@/components/MemoryTimeline";
import { motion, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
  images: readonly string[];
}

const photoMats = [
  "bg-[#D8E0D8] border-[#A8B8AA]",
  "bg-[#E5D7D3] border-[#C9AAA5]",
  "bg-[#D7DFE4] border-[#A9BAC6]",
  "bg-[#E8DFC9] border-[#C9B994]",
];

export default function HeroSection({ images }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen overflow-hidden bg-mist text-ink">
      <motion.section
        id="home"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid min-h-[76svh] w-full max-w-7xl content-center gap-9 px-5 pb-14 pt-14 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-12 lg:pb-20 lg:pt-20"
      >
        <div className="flex flex-col items-start justify-center">
          <p className="mb-5 text-sm font-semibold text-berry">
            A birthday page for Sharmila
          </p>
          <h1 className="max-w-xl font-display text-[clamp(3.35rem,7.6vw,6.7rem)] leading-[0.96] tracking-[-0.045em]">
            Happy Birthday, Sharmila.
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-ink/85 sm:text-lg">
            Every photograph holds a little piece of a day we shared.
            I wanted to keep them all somewhere you can come back to.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#photographs"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-berry px-6 py-3 text-sm font-semibold text-[#F8F4F0] transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
            >
              See every photograph
            </a>
            <Link
              href="/letter"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-berry underline decoration-rose underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
            >
              Read the letter
            </Link>
          </div>
          <p className="mt-10 border-l-2 border-rose pl-4 font-display text-xl italic leading-snug text-berry sm:text-2xl">
            The best moments deserve to be kept.
          </p>
        </div>

        <a
          href="#photographs"
          aria-label="Go to the birthday photographs"
          className="group relative block aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-[#A8B8AA] bg-[#D8E0D8] p-2 shadow-[0_18px_48px_rgba(41,53,50,0.12)] transition-shadow duration-300 hover:shadow-[0_22px_54px_rgba(41,53,50,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry sm:aspect-[5/4] lg:aspect-[4/5]"
        >
          {images[0] ? (
            <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-[#E9ECE6]">
              <Image
                src={images[0]}
                alt="A photograph from the birthday collection"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          ) : (
            <span className="flex h-full items-center justify-center px-8 text-center text-berry">
              Add the birthday photographs to the collection.
            </span>
          )}
        </a>
      </motion.section>

      <MemoryTimeline images={images} />

      <section
        id="photographs"
        aria-labelledby="photographs-heading"
        className="mx-auto w-full max-w-7xl scroll-mt-8 px-5 pb-32 sm:px-8 lg:px-12"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 border-t border-ink/20 pt-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-berry">All together, on one page</p>
            <h2
              id="photographs-heading"
              className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl"
            >
              The photographs
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink/75">
            Every photo is shown in full, without cutting off the moment.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {images.map((src, index) => {
              const ratio = index % 5 === 0 ? "aspect-[5/4]" : index % 4 === 2 ? "aspect-[3/4]" : "aspect-[4/5]";
              return (
                <figure
                  key={src}
                  className={`group mb-3 break-inside-avoid overflow-hidden rounded-[1.1rem] border p-2 shadow-[0_8px_24px_rgba(41,53,50,0.09)] transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(41,53,50,0.16)] sm:mb-4 sm:rounded-[1.35rem] sm:p-2.5 ${photoMats[index % photoMats.length]}`}
                >
                  <div className={`relative w-full overflow-hidden rounded-[0.75rem] bg-[#F0F1EC] ${ratio}`}>
                    <Image
                      src={src}
                      alt={`Photo ${index + 1} from the birthday collection`}
                      fill
                      priority={index < 4}
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
                      className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  </div>
                </figure>
              );
            })}
          </div>
        ) : (
          <p className="border-t border-ink/20 py-8 text-sm text-berry">
            No photographs are available yet. Add image paths to the birthday photo collection to show them here.
          </p>
        )}

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/20 pt-6 text-sm">
          <Link className="font-semibold text-berry underline decoration-rose underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/memories">
            More memories
          </Link>
          <Link className="font-semibold text-berry underline decoration-rose underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/surprise">
            A birthday surprise
          </Link>
          <Link className="font-semibold text-berry underline decoration-rose underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/blog">
            The journal
          </Link>
        </div>
      </section>
    </div>
  );
}
