"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { birthdayConfig } from "@/data/birthdayConfig";
import { Sparkles, X } from "lucide-react";

const PET_WIDTH = 116;
const PET_HEIGHT = 226;

export default function RoamingMascot() {
  const [messageIndex, setMessageIndex] = useState<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const mascot = birthdayConfig.mascot;

  useEffect(() => {
    const place = () => {
      setPosition((current) => ({
        x: Math.min(Math.max(current.x || window.innerWidth - PET_WIDTH - 24, 8), window.innerWidth - PET_WIDTH - 8),
        y: Math.min(Math.max(current.y || window.innerHeight * 0.48, 8), window.innerHeight - PET_HEIGHT - 12),
      }));
      setReady(true);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const moveTo = useCallback((clientX: number, clientY: number) => {
    setPosition({
      x: Math.min(Math.max(clientX - dragOffset.current.x, 8), window.innerWidth - PET_WIDTH - 8),
      y: Math.min(Math.max(clientY - dragOffset.current.y, 8), window.innerHeight - PET_HEIGHT - 12),
    });
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (event: PointerEvent) => moveTo(event.clientX, event.clientY);
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.userSelect = "";
    };
  }, [dragging, moveTo]);

  if (!mascot.enabled) return null;

  const nextHint = () => setMessageIndex((index) => index === null ? 0 : (index + 1) % mascot.messages.length);
  const startDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if ((event.target as HTMLElement).closest("[data-pet-close]")) return;
    dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y };
    setDragging(true);
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden sm:block"
      aria-label="Interactive birthday companion"
    >
      {ready && (
        <motion.div
          className="pointer-events-auto absolute touch-none"
          style={{ left: 0, top: 0, x: position.x, y: position.y, width: PET_WIDTH }}
          animate={dragging || reduceMotion ? undefined : { y: [position.y, position.y - 12, position.y + 5, position.y] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            setTilt({ x: Math.max(-7, Math.min(7, -py * 12)), y: Math.max(-9, Math.min(9, px * 16)) });
          }}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <AnimatePresence>
            {messageIndex !== null && (
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute bottom-[calc(100%-8px)] right-0 mb-3 w-60 rounded-2xl border border-[#E7B7B4] bg-[#FFF9F4] p-3 text-left text-xs leading-5 text-[#59313F] shadow-[0_16px_45px_rgba(54,26,39,.22)]"
              >
                <button type="button" data-pet-close onClick={() => setMessageIndex(null)} aria-label="Close hint" className="absolute right-2 top-2 rounded-full p-1 text-[#8B294B] hover:bg-[#F8E5E3]"><X size={13} /></button>
                <p className="pr-5">{mascot.messages[messageIndex]}</p>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[#A43F60]">Tap me for another hint</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onPointerDown={startDrag}
            onClick={() => { if (!dragging) nextHint(); }}
            aria-label={mascot.ariaLabel + ". Drag to move, tap for a birthday hint."}
            aria-expanded={messageIndex !== null}
            className="group flex w-full cursor-grab flex-col items-center rounded-3xl p-1 active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]"
          >
            <motion.div
              className="relative w-[112px] [perspective:900px]"
              animate={reduceMotion ? undefined : { rotateX: tilt.x, rotateY: tilt.y, rotateZ: dragging ? 0 : [0, 1.2, -1.2, 0] }}
              transition={{ type: "spring", stiffness: 170, damping: 18, mass: 0.7 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                src="/images/sharmila-mascot.webp"
                alt=""
                draggable={false}
                className="relative z-10 block h-auto w-full select-none drop-shadow-[0_18px_16px_rgba(55,28,42,.24)]"
                whileHover={reduceMotion ? undefined : { scale: 1.055, y: -5 }}
                style={{ transform: "translateZ(18px)" }}
              />
              <span className="pointer-events-none absolute -bottom-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-[50%] bg-[#5D344A]/20 blur-md" />
              <Sparkles className="pointer-events-none absolute right-0 top-[27%] z-20 h-4 w-4 text-[#C18B45] drop-shadow" />
              <span className="pointer-events-none absolute left-0 top-[42%] z-20 h-2 w-2 rounded-full bg-white/70 blur-[1px]" />
            </motion.div>
            <span className="mt-1 flex items-center gap-1 rounded-full border border-white/90 bg-[#FFF9F4]/95 px-3 py-1.5 text-[10px] font-extrabold text-[#8B294B] shadow-[0_6px_20px_rgba(69,30,49,.16)]">
              <Sparkles size={11} />{mascot.label}
            </span>
            <span className="mt-1 text-[9px] font-semibold text-[#8B294B]/70 opacity-0 transition-opacity group-hover:opacity-100">drag me around</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
