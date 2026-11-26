"use client";

import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  images: readonly string[] | string[];
}

export default function HeroSection({ images }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <section
        id="home"
        className="mx-auto grid min-h-[72svh] w-full max-w-7xl content-center gap-8 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12 lg:pb-20"
      >
        <div className="flex flex-col items-start justify-center">
          <p className="mb-5 text-sm font-semibold text-berry">
            A birthday page for Sharmila
          </p>
          <h1 className="max-w-xl font-display text-[clamp(3.4rem,8vw,6.8rem)] leading-[0.98] tracking-[-0.045em]">
            Happy Birthday, Sharmila.
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-ink/80 sm:text-lg">
            I gathered these photographs here so you can revisit the little
            moments whenever you want.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#photographs"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-berry px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
            >
              See the photographs
            </a>
            <Link
              href="/letter"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-berry underline decoration-rose/60 underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
            >
              Read the letter
            </Link>
          </div>
        </div>

        <a
          href="#photographs"
          aria-label="Go to the birthday photographs"
          className="group relative block min-h-[330px] overflow-hidden rounded-[2rem] bg-sage/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry sm:min-h-[470px] lg:min-h-[540px]"
        >
          {images[0] ? (
            <Image
              src={images[0]}
              alt="A photograph from the birthday collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center px-8 text-center text-berry">
              Add the birthday photographs to the collection.
            </span>
          )}
        </a>
      </section>

      <section
        id="photographs"
        aria-labelledby="photographs-heading"
        className="mx-auto w-full max-w-7xl scroll-mt-8 px-5 pb-32 sm:px-8 lg:px-12"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 border-t border-ink/15 pt-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-berry">Kept in one place</p>
            <h2
              id="photographs-heading"
              className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl"
            >
              The photographs
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink/75">
            A collection of moments, all together on this page.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="grid auto-rows-[145px] grid-cols-2 gap-2.5 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {images.map((src, index) => {
              const feature = index === 0;
              const tall = !feature && index % 7 === 3;
              const wide = !feature && index % 6 === 2;

              return (
                <figure
                  key={src}
                  className={[
                    "group relative min-h-0 overflow-hidden bg-sage/25",
                    feature ? "col-span-2 row-span-2 rounded-[1.75rem]" : "",
                    tall ? "row-span-2 rounded-[1.25rem]" : "",
                    wide ? "col-span-2 rounded-[1.25rem]" : "",
                    !feature && !tall && !wide ? "rounded-[1.25rem]" : "",
                  ].join(" ")}
                >
                  <Image
                    src={src}
                    alt={`Photo ${index + 1} from the birthday collection`}
                    fill
                    priority={index < 3}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                </figure>
              );
            })}
          </div>
        ) : (
          <p className="border-t border-ink/15 py-8 text-sm text-berry">
            No photographs are available yet. Add image paths to the birthday
            photo collection to show them here.
          </p>
        )}

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/15 pt-6 text-sm">
          <Link className="font-semibold text-berry underline decoration-rose/60 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/memories">
            More memories
          </Link>
          <Link className="font-semibold text-berry underline decoration-rose/60 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/surprise">
            A birthday surprise
          </Link>
          <Link className="font-semibold text-berry underline decoration-rose/60 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry" href="/blog">
            The journal
          </Link>
        </div>
      </section>
    </div>
  );
}
