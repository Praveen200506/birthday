"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { birthdayConfig } from "@/data/birthdayConfig";
import { Heart, Sparkles } from "lucide-react";

export default function RoamingMascot() {
  const [message, setMessage] = useState(false);
  const reduceMotion = useReducedMotion();
  const notes = [
    "Psst… there are more memories waiting to be explored.",
    "A little wish can make a big day even brighter.",
    "Have you read the birthday letter yet?",
  ];
  return (
    <motion.div
      className="pointer-events-none fixed right-3 top-[34%] z-[45] hidden sm:block md:right-6"
      animate={reduceMotion ? undefined : { y: [0, -18, 8, -12, 0], x: [0, -8, 4, 0] }}
      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
    >
      <button type="button" onClick={() => setMessage((value) => !value)}
        aria-label="Ask the birthday companion for a little hint"
        aria-expanded={message}
        className="pointer-events-auto group relative flex flex-col items-center rounded-full p-1 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]">
        <AnimatePresence>
          {message && <motion.span initial={{ opacity: 0, y: 8, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full right-0 mb-3 w-52 rounded-2xl border border-[#E7B7B4] bg-[#FFF9F4] p-3 text-left text-xs leading-5 text-[#59313F] shadow-xl">
            {notes[Math.floor(Math.random() * notes.length)]}
          </motion.span>}
        </AnimatePresence>
        <svg viewBox="0 0 112 166" role="img" aria-label="A little animated birthday companion" className="h-28 w-20 drop-shadow-[0_12px_12px_rgba(70,35,52,.22)] transition-transform group-hover:-rotate-3 sm:h-36 sm:w-24">
          <defs>
            <linearGradient id="dress" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#F6B8C0"/><stop offset="1" stopColor="#9B3D5B"/></linearGradient>
            <linearGradient id="skin" x1="0" x2="1"><stop stopColor="#F8D4B9"/><stop offset="1" stopColor="#D99A79"/></linearGradient>
            <linearGradient id="hair" x1="0" x2="1"><stop stopColor="#3C2730"/><stop offset="1" stopColor="#120F17"/></linearGradient>
          </defs>
          <ellipse cx="56" cy="158" rx="29" ry="5" fill="#7C4053" opacity=".18"/>
          <path d="M34 51 Q16 62 24 106 L31 132 Q55 147 80 130 L87 91 Q91 61 72 49Z" fill="url(#hair)"/>
          <path d="M43 113 L39 151 M68 113 L75 151" stroke="#D99A79" strokeWidth="8" strokeLinecap="round"/>
          <path d="M36 146 L29 157 M73 146 L81 157" stroke="#4B2938" strokeWidth="8" strokeLinecap="round"/>
          <path d="M37 61 Q19 67 15 94 L11 113" stroke="#D99A79" strokeWidth="9" strokeLinecap="round" fill="none"/>
          <path d="M75 62 Q94 68 98 91 L100 104" stroke="#D99A79" strokeWidth="9" strokeLinecap="round" fill="none"/>
          <path d="M38 62 Q56 48 75 62 L91 119 Q56 140 21 119Z" fill="url(#dress)" stroke="#8B294B" strokeWidth="1.5"/>
          <path d="M43 65 L56 83 L69 65" fill="#FFF0E9" opacity=".9"/>
          <path d="M39 117 Q56 125 74 117" stroke="#F9D9D8" strokeWidth="3" fill="none"/>
          <path d="M35 38 Q34 12 56 12 Q81 12 79 42 L76 60 Q69 75 55 75 Q40 73 35 56Z" fill="url(#skin)"/>
          <path d="M32 43 Q26 12 54 7 Q85 5 83 39 L79 54 Q75 30 62 27 Q48 39 34 36Z" fill="url(#hair)"/>
          <path d="M34 31 Q20 50 33 74 L40 82 L39 54Z" fill="url(#hair)"/>
          <path d="M76 29 Q91 50 78 76 L72 82 L74 52Z" fill="url(#hair)"/>
          <ellipse cx="47" cy="44" rx="2" ry="2.8" fill="#38252E"/><ellipse cx="65" cy="44" rx="2" ry="2.8" fill="#38252E"/>
          <path d="M50 56 Q56 61 62 56" stroke="#A84B61" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="40" cy="53" r="4" fill="#E98591" opacity=".45"/><circle cx="71" cy="53" r="4" fill="#E98591" opacity=".45"/>
          <path d="M44 14 Q55 1 68 12" stroke="#E9B85E" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M57 7 L62 1 L67 7 L62 12Z" fill="#E9B85E"/>
        </svg>
        <span className="mt-1 flex items-center gap-1 rounded-full border border-white/80 bg-[#FFF9F4]/90 px-2 py-1 text-[9px] font-bold text-[#8B294B] shadow-sm"><Sparkles size={10}/> Birthday buddy</span>
      </button>
    </motion.div>
  );
}
