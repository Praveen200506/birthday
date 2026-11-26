"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, RotateCcw, X } from "lucide-react";
import Cake from "./Cake";
import { birthdayConfig as config } from "@/data/birthdayConfig";

export default function SurpriseSection() {
  const [candlesOut, setCandlesOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [cakeRun, setCakeRun] = useState(0);
  const reduceMotion = useReducedMotion();

  const handleAllCandlesOut = () => {
    if (candlesOut) return;
    setCandlesOut(true);
    if (!reduceMotion) confetti({ particleCount: 140, spread: 100, startVelocity: 42, origin: { y: 0.58 }, colors: ["#8B294B", "#E98591", "#F5C46B", "#B7A6D8", "#FFF0E9"], zIndex: 120 });
  };
  const openFinalScene = () => {
    setIsOpen(false);
    setShowFinal(true);
    window.dispatchEvent(new Event("final-scene"));
  };
  const restart = () => {
    setIsOpen(false);
    setShowFinal(false);
    setCandlesOut(false);
    setCakeRun((run) => run + 1);
  };

  return (
    <section className="relative z-10 min-h-[calc(100svh-2rem)] w-full overflow-hidden bg-transparent px-4 pb-36 pt-10 sm:px-8 lg:flex lg:items-center lg:justify-center lg:gap-12 lg:pt-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="birthday-drift absolute left-[12%] top-16 h-32 w-32 rounded-full bg-[#F3A5A2]/35 blur-3xl" />
        <span className="birthday-drift absolute right-[12%] top-36 h-40 w-40 rounded-full bg-[#F7C77D]/35 blur-3xl" />
        <span className="birthday-twinkle absolute left-[24%] top-1/3 h-3 w-3 rotate-45 bg-[#D65A7D]/80" />
        <span className="birthday-twinkle absolute right-[22%] top-1/2 h-2.5 w-2.5 rotate-45 bg-[#C18B45]/80" />
      </div>
      <motion.header initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
        className="relative z-10 mx-auto mb-6 max-w-2xl px-3 text-center lg:mb-0 lg:w-[36%] lg:pr-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#A43F60]">{config.surprise.eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-[#38252E] sm:text-6xl">{config.surprise.heading}</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#684E55] sm:text-base">{config.surprise.instructions}</p>
        <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-[#E7B7B4] bg-white/65 p-4 text-left shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#A43F60]">A tiny birthday thought</p>
          <p className="mt-2 font-display text-lg italic text-[#59313F]">{config.surprise.prompts[0]}</p>
        </div>
      </motion.header>

      <div className="relative z-10 mx-auto w-full max-w-[680px] lg:mx-0 lg:w-[48%]">
        {!candlesOut ? <Cake key={cakeRun} onAllCandlesOut={handleAllCandlesOut} /> : (
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="birthday-glow mx-auto mt-8 max-w-lg rounded-3xl border border-[#E7B7B4] bg-[#FFF9F4]/95 p-7 shadow-[0_18px_55px_rgba(126,53,74,0.16)] backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE5E8] text-[#8B294B]"><Heart size={26} fill="currentColor" /></div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A43F60]">All five candles, one wish</p>
            <h2 className="mt-3 font-display text-3xl text-[#38252E] sm:text-4xl">{config.surprise.completedTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#684E55]">{config.surprise.completedCopy}</p>
            <button type="button" onClick={() => setIsOpen(true)} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#672039] bg-[#8B294B] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#64243D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]">
              Open your birthday wish <ArrowRight size={17} />
            </button>
            <button type="button" onClick={restart} className="mx-auto mt-4 flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-bold text-[#8B294B] transition hover:bg-[#FCE5E8]"><RotateCcw size={14} /> Start again</button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#38252E]/70 p-3 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="birthday-wish-title" className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-[#FFFAF5] p-7 text-center shadow-2xl sm:p-10"
            initial={reduceMotion ? false : { y: 35, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.97 }} onClick={(event) => event.stopPropagation()}>
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#8B294B] via-[#E98591] to-[#F2C36B]" />
            <button type="button" aria-label="Close birthday wish" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7E8E5] text-[#672039]"><X size={17} /></button>
            <motion.div initial={reduceMotion ? false : { scale: 0.7, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.12 }} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FCE5E8] text-[#8B294B]"><Heart size={30} fill="currentColor" /></motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A43F60]">Made with love</p>
            <h2 id="birthday-wish-title" className="mt-3 font-display text-4xl text-[#38252E] sm:text-5xl">{config.surprise.modalTitle}</h2>
            <p className="mt-5 font-display text-xl italic leading-relaxed text-[#684E55]">&ldquo;{config.surprise.modalWish}&rdquo;</p>
            <p className="mt-4 text-sm leading-6 text-[#795F65]">{config.surprise.modalCopy}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => setIsOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#672039] bg-[#8B294B] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#64243D]">Thank you</button>
              <button type="button" onClick={openFinalScene} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#8B294B] bg-white px-6 py-3 text-sm font-bold text-[#8B294B] transition hover:bg-[#FCE5E8]">One last message <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
      {showFinal && <span className="sr-only" role="status">The final birthday message is open.</span>}
    </section>
  );
}
