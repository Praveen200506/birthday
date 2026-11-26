"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { birthdayConfig } from "@/data/birthdayConfig";
import { Sparkles } from "lucide-react";

export default function RoamingMascot() {
  const [messageIndex, setMessageIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const mascot = birthdayConfig.mascot;
  if (!mascot.enabled) return null;
  // Cycle through configured hints with state; never choose random content during render.
  const nextHint = () => setMessageIndex((index) => index === null ? 0 : (index + 1) % mascot.messages.length);

  return (
    <motion.div
      className="pointer-events-none fixed right-2 top-[36%] z-[45] hidden sm:block md:right-5"
      animate={reduceMotion ? undefined : { y: [0, -17, 7, -11, 0], x: [0, -7, 4, 0], rotate: [0, 2, -1, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <button type="button" onClick={nextHint}
        aria-label={mascot.ariaLabel}
        aria-expanded={messageIndex !== null}
        className="pointer-events-auto group relative flex flex-col items-center rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]">
        <AnimatePresence mode="wait">
          {messageIndex !== null && <motion.span key={messageIndex}
            initial={{ opacity: 0, y: 10, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .96 }}
            className="absolute bottom-full right-0 mb-3 w-56 rounded-2xl border border-[#E7B7B4] bg-[#FFF9F4] p-3 text-left text-xs leading-5 text-[#59313F] shadow-[0_16px_45px_rgba(54,26,39,.22)]">
            {mascot.messages[messageIndex]}
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[#A43F60]">Tap for another little hint</span>
          </motion.span>}
        </AnimatePresence>
        <motion.span whileHover={reduceMotion ? undefined : { scale: 1.07, rotate: -4 }} className="relative block h-[142px] w-[96px] [perspective:700px] sm:h-[164px] sm:w-[112px]">
          <span className="absolute bottom-1 left-1/2 h-3 w-14 -translate-x-1/2 rounded-[50%] bg-[#6C3B50]/20 blur-md"/>
          <span className="absolute inset-x-3 bottom-2 top-7 rounded-[48%_48%_35%_35%] border border-white/70 bg-gradient-to-br from-[#F9C6CD] via-[#E985A0] to-[#8B294B] shadow-[inset_-8px_-8px_14px_rgba(76,25,49,.25),inset_5px_5px_12px_rgba(255,255,255,.55),0_14px_18px_rgba(69,30,49,.24)] [transform:rotateY(-12deg)]"/>
          <span className="absolute left-1/2 top-1 h-[76px] w-[67px] -translate-x-1/2 rounded-[48%_48%_45%_45%] border border-[#B87968]/40 bg-gradient-to-br from-[#FFE1C9] via-[#EFC0A7] to-[#BD806D] shadow-[inset_-7px_-5px_10px_rgba(112,57,49,.16),inset_4px_4px_9px_rgba(255,255,255,.7),0_8px_12px_rgba(62,32,43,.2)]"/>
          <span className="absolute left-[19px] top-0 h-[79px] w-[74px] rounded-[48%_48%_40%_40%] bg-gradient-to-br from-[#4D3540] via-[#241923] to-[#100C12] shadow-[inset_-8px_-3px_9px_rgba(0,0,0,.6),inset_4px_3px_7px_rgba(255,255,255,.16)]"/>
          <span className="absolute left-[17px] top-[37px] h-[66px] w-[22px] rounded-[50%] bg-gradient-to-r from-[#1B121A] to-[#59404B] shadow-md"/>
          <span className="absolute right-[16px] top-[36px] h-[68px] w-[21px] rounded-[50%] bg-gradient-to-r from-[#59404B] to-[#1B121A] shadow-md"/>
          <span className="absolute left-[35px] top-[51px] h-1.5 w-1.5 rounded-full bg-[#38252E] shadow-[12px_0_0_#38252E]"/>
          <span className="absolute left-[43px] top-[67px] h-2 w-4 rounded-b-full border-b-2 border-[#A84B61]"/>
          <span className="absolute left-[30px] top-[63px] h-2.5 w-3 rounded-full bg-[#E98591]/55 blur-[2px]"/>
          <span className="absolute right-[29px] top-[63px] h-2.5 w-3 rounded-full bg-[#E98591]/55 blur-[2px]"/>
          <span className="absolute left-[42px] top-[5px] h-5 w-8 rotate-[-12deg] rounded-full border-t-[5px] border-[#E9B85E]"/>
          <span className="absolute left-[55px] top-[1px] h-3 w-3 rotate-45 rounded-sm bg-gradient-to-br from-[#FFF0B9] to-[#C18B45] shadow-md"/>
          <span className="absolute left-[7px] top-[91px] h-8 w-4 rotate-[-35deg] rounded-full border border-[#D77B91] bg-gradient-to-b from-[#F6C6C8] to-[#A64264] shadow-md"/>
          <span className="absolute right-[5px] top-[91px] h-8 w-4 rotate-[35deg] rounded-full border border-[#D77B91] bg-gradient-to-b from-[#F6C6C8] to-[#A64264] shadow-md"/>
          <Sparkles className="absolute right-0 top-8 h-4 w-4 text-[#C18B45] drop-shadow" />
        </motion.span>
        <span className="mt-1 flex items-center gap-1 rounded-full border border-white/90 bg-[#FFF9F4]/95 px-3 py-1.5 text-[10px] font-extrabold text-[#8B294B] shadow-[0_6px_20px_rgba(69,30,49,.16)]"><Sparkles size={11}/>{mascot.label}</span>
      </button>
    </motion.div>
  );
}
