"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { birthdayConfig } from "@/data/birthdayConfig";
import sharmilaMascotSrc from "@/data/sharmilaMascot";
import { Sparkles, X } from "lucide-react";

type PetState = "idle" | "walking" | "curious" | "following" | "jumping" | "sitting" | "sleeping" | "dragging";
type Point = { x: number; y: number };

const PET_WIDTH = 116;
const PET_HEIGHT = 226;
const EDGE_GAP = 8;
const SPEED = 112;
const ARRIVAL_DISTANCE = 5;
const CURSOR_RADIUS = 190;
const INACTIVITY_BEFORE_SLEEP = 90_000;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

export default function RoamingMascot() {
  const [messageText, setMessageText] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roamingPaused, setRoamingPaused] = useState(false);
  const introShownRef = useRef(false);
  const pathname = usePathname();
  const [petState, setPetState] = useState<PetState>("idle");
  const [facingLeft, setFacingLeft] = useState(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [cursorNear, setCursorNear] = useState(false);

  const petRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const destinationRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point | null>(null);
  const stateRef = useRef<PetState>("idle");
  const facingLeftRef = useRef(false);
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const pointerStartRef = useRef<Point | null>(null);
  const didDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const lastFrameRef = useRef(0);
  const stateDeadlineRef = useRef(0);
  const nextDecisionRef = useRef(0);
  const lastActivityRef = useRef(0);
  const lastCursorReactionRef = useRef(0);
  const followDeadlineRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const mascot = birthdayConfig.mascot;
  const pageHints = pathname.startsWith("/memories")
    ? ["This is the Memories page. Browse the saved moments here.", "Tap a memory to open it, or use the upload option to add another photo.", "I will keep you company while you explore these memories."]
    : pathname.startsWith("/letter")
      ? ["We are on the Letter page. This is where the birthday message lives.", "Take your time reading the letter. It was made for this celebration.", "Use the navigation whenever you want to visit another page."]
      : pathname.startsWith("/surprise")
        ? ["Welcome to the Surprise page! Follow the instructions here to reveal the surprise.", "Make a wish before you finish the candle activity.", "Tap the candles on this page to continue."]
        : pathname.startsWith("/blog")
          ? ["This is the Blog page. You can browse the posts shared here.", "Open a post to read the full story.", "Use the write option if you have access to create a post."]
          : pathname === "/"
            ? ["We are on the Home page. Start with the birthday highlights and photos.", "Use the navigation to visit Memories, Letter, Surprise, or Blog.", "Scroll through this page to explore the birthday collection."]
            : ["I can help you explore this page. Check its headings and buttons for the available actions."];
  const introMessage = "Hi! I’m Nandhuuuu, your little website companion. Tap me for hints about the page you’re visiting. Right-click me to control what I do!";

  const setState = useCallback((next: PetState, duration = 0) => {
    stateRef.current = next;
    setPetState(next);
    stateDeadlineRef.current = duration > 0 ? performance.now() + duration : 0;
  }, []);

  const bounds = useCallback(() => {
    const width = petRef.current?.offsetWidth || PET_WIDTH;
    const height = petRef.current?.offsetHeight || PET_HEIGHT;
    return {
      maxX: Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP),
      maxY: Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP),
    };
  }, []);

  const clampPoint = useCallback((point: Point): Point => {
    const limit = bounds();
    return {
      x: Math.min(Math.max(point.x, EDGE_GAP), limit.maxX),
      y: Math.min(Math.max(point.y, EDGE_GAP), limit.maxY),
    };
  }, [bounds]);

  const renderPosition = useCallback(() => {
    if (!petRef.current) return;
    const { x, y } = positionRef.current;
    petRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const chooseDestination = useCallback((near?: Point) => {
    const limit = bounds();
    const current = positionRef.current;
    let next: Point;
    if (near) {
      const angle = Math.random() * Math.PI * 2;
      const radius = randomBetween(54, 92);
      next = { x: near.x + Math.cos(angle) * radius, y: near.y + Math.sin(angle) * radius };
    } else {
      const spreadX = Math.min(340, Math.max(120, limit.maxX * 0.48));
      const spreadY = Math.min(240, Math.max(100, limit.maxY * 0.38));
      next = {
        x: current.x + randomBetween(-spreadX, spreadX),
        y: current.y + randomBetween(-spreadY, spreadY),
      };
    }
    destinationRef.current = clampPoint(next);
    const dx = destinationRef.current.x - current.x;
    if (Math.abs(dx) > 2) {
      facingLeftRef.current = dx < 0;
      setFacingLeft(dx < 0);
    }
    setState(near ? "following" : "walking");
    followDeadlineRef.current = near ? performance.now() + 5_000 : 0;
  }, [bounds, clampPoint, setState]);

  useEffect(() => {
    if (!mascot.enabled) return;

    lastActivityRef.current = Date.now();
    const initial = clampPoint({
      x: window.innerWidth - PET_WIDTH - 24,
      y: window.innerHeight * 0.48,
    });
    positionRef.current = initial;
    destinationRef.current = initial;
    renderPosition();
    setReady(true);

    const onResize = () => {
      positionRef.current = clampPoint(positionRef.current);
      destinationRef.current = clampPoint(destinationRef.current);
      renderPosition();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cursorRef.current = { x: event.clientX, y: event.clientY };
      lastActivityRef.current = Date.now();
    };
    const onActivity = () => { lastActivityRef.current = Date.now(); };
    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastFrameRef.current = 0;
      } else if (rafRef.current === null) {
        lastFrameRef.current = 0;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    function tick(now: number) {
      if (document.hidden) {
        rafRef.current = null;
        return;
      }

      const previous = lastFrameRef.current || now;
      const dt = Math.min((now - previous) / 1000, 0.05);
      lastFrameRef.current = now;

      if (roamingPaused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const currentState = stateRef.current;
      if (currentState !== "dragging" && currentState !== "jumping" && currentState !== "sleeping" && currentState !== "sitting") {
        const cursor = cursorRef.current;
        const petCenter = { x: positionRef.current.x + PET_WIDTH / 2, y: positionRef.current.y + PET_HEIGHT / 2 };
        const cursorDistance = cursor ? distance(petCenter, cursor) : Infinity;

        if (cursorDistance < CURSOR_RADIUS && now - lastCursorReactionRef.current > 2_500 && currentState !== "following") {
          lastCursorReactionRef.current = now;
          setCursorNear(true);
          if (Math.random() < 0.28 && cursor) {
            chooseDestination({ x: cursor.x - PET_WIDTH / 2, y: cursor.y - PET_HEIGHT / 2 });
          } else if (currentState !== "walking") {
            setState("curious", 2_200);
          }
        } else if (cursorDistance >= CURSOR_RADIUS) {
          setCursorNear(false);
        }
      }

      if (stateRef.current === "walking" || stateRef.current === "following") {
        const destination = destinationRef.current;
        const current = positionRef.current;
        const remaining = distance(current, destination);
        if (remaining <= ARRIVAL_DISTANCE || (stateRef.current === "following" && now > followDeadlineRef.current)) {
          positionRef.current = destination;
          renderPosition();
          setState("idle");
          nextDecisionRef.current = now + randomBetween(2_000, 5_500);
        } else {
          const step = Math.min(remaining, SPEED * dt);
          positionRef.current = clampPoint({
            x: current.x + ((destination.x - current.x) / remaining) * step,
            y: current.y + ((destination.y - current.y) / remaining) * step,
          });
          renderPosition();
        }
      }

      if (stateRef.current === "curious" && stateDeadlineRef.current && now >= stateDeadlineRef.current) {
        setState("idle");
        nextDecisionRef.current = now + randomBetween(1_800, 4_000);
      }

      if (stateRef.current === "jumping" && stateDeadlineRef.current && now >= stateDeadlineRef.current) {
        setState("idle");
        nextDecisionRef.current = now + 1_000;
      }

      if (stateRef.current === "sitting" && stateDeadlineRef.current && now >= stateDeadlineRef.current) {
        setState("idle");
        nextDecisionRef.current = now + randomBetween(1_500, 3_500);
      }

      if (stateRef.current === "sleeping" && stateDeadlineRef.current && now >= stateDeadlineRef.current) {
        setState("idle");
        nextDecisionRef.current = now + 1_500;
      }

      if (stateRef.current === "idle" && now >= nextDecisionRef.current) {
        if (Date.now() - lastActivityRef.current > INACTIVITY_BEFORE_SLEEP && Math.random() < 0.7) {
          setState("sleeping", randomBetween(8_000, 15_000));
        } else {
          const roll = Math.random();
          if (roll < 0.10) setState("sitting", randomBetween(3_500, 7_000));
          else if (roll < 0.16) setState("curious", randomBetween(1_500, 3_000));
          else if (roll < 0.23 && cursorRef.current) chooseDestination({
            x: cursorRef.current.x - PET_WIDTH / 2,
            y: cursorRef.current.y - PET_HEIGHT / 2,
          });
          else chooseDestination();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    const onResizeBound = () => onResize();
    window.addEventListener("resize", onResizeBound);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("pointerdown", onActivity, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    nextDecisionRef.current = performance.now() + 1_000;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResizeBound);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("pointerdown", onActivity);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mascot.enabled, clampPoint, chooseDestination, renderPosition, setState, reducedMotion, roamingPaused]);

  const moveDraggedPet = useCallback((clientX: number, clientY: number) => {
    positionRef.current = clampPoint({
      x: clientX - dragOffsetRef.current.x,
      y: clientY - dragOffsetRef.current.y,
    });
    renderPosition();
  }, [clampPoint, renderPosition]);

  useEffect(() => {
    if (!dragging) return;
    const move = (event: PointerEvent) => {
      if (!pointerStartRef.current) return;
      if (distance(pointerStartRef.current, { x: event.clientX, y: event.clientY }) > 5) didDragRef.current = true;
      moveDraggedPet(event.clientX, event.clientY);
    };
    const stop = () => {
      setDragging(false);
      setState("idle");
      nextDecisionRef.current = performance.now() + randomBetween(900, 1_800);
      if (didDragRef.current) suppressClickRef.current = true;
      pointerStartRef.current = null;
      document.body.style.userSelect = "";
    };
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
  }, [dragging, moveDraggedPet, setState]);

  if (!mascot.enabled) return null;

  const showNextHint = () => {
    if (!introShownRef.current) {
      introShownRef.current = true;
      setMessageText(introMessage);
      return;
    }
    setMessageText(pageHints[messageIndex % pageHints.length]);
    setMessageIndex((index) => (index + 1) % pageHints.length);
  };
  const openPetMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen((open) => !open);
  };
  const runPetAction = (action: "pause" | "follow" | "walk" | "sit" | "sleep" | "jump" | "wake") => {
    setMenuOpen(false);
    if (action === "pause") {
      setRoamingPaused((paused) => !paused);
      setState("idle");
      return;
    }
    setRoamingPaused(false);
    if (action === "follow") {
      const cursor = cursorRef.current;
      if (cursor) chooseDestination({ x: cursor.x - PET_WIDTH / 2, y: cursor.y - PET_HEIGHT / 2 });
      else setState("curious", 2200);
    }
    if (action === "walk") chooseDestination();
    if (action === "sit") setState("sitting", 8000);
    if (action === "sleep") setState("sleeping", 15000);
    if (action === "jump") setState("jumping", 760);
    if (action === "wake") setState("idle");
  };
  const startDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("[data-pet-close], [data-pet-menu]")) return;
    event.preventDefault();
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    dragOffsetRef.current = { x: event.clientX - positionRef.current.x, y: event.clientY - positionRef.current.y };
    didDragRef.current = false;
    setDragging(true);
    setState("dragging");
  };
  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (didDragRef.current) return;
    showNextHint();
    setState("jumping", 760);
    nextDecisionRef.current = performance.now() + 760;
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-label="Interactive birthday companion">
      {ready && (
        <div
          ref={petRef}
          className="pointer-events-auto absolute left-0 top-0 w-[96px] sm:w-[116px] touch-none will-change-transform"
          style={{ transform: `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)` }}
        >
          <AnimatePresence>
            {messageText !== null && (
              <motion.div
                key={messageText}
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute bottom-[calc(100%-8px)] right-0 mb-3 w-60 max-w-[min(15rem,85vw)] rounded-2xl border border-[#E7B7B4] bg-[#FFF9F4] p-3 text-left text-xs leading-5 text-[#59313F] shadow-[0_16px_45px_rgba(54,26,39,.22)]"
              >
                <button type="button" data-pet-close onClick={() => setMessageText(null)} aria-label="Close hint" className="absolute right-2 top-2 rounded-full p-1 text-[#8B294B] hover:bg-[#F8E5E3]"><X size={13} /></button>
                <p className="pr-5">{messageText}</p>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[#A43F60]">Hints for this page</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onPointerDown={startDrag}
            onClick={handleClick}
            onContextMenu={openPetMenu}
            aria-label={mascot.ariaLabel + ". Drag to move, tap for a birthday hint."}
            aria-expanded={messageText !== null || menuOpen}
            className="group flex w-full cursor-grab flex-col items-center rounded-3xl p-1 active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B294B]"
          >
            <div className={`chibi-pet-sprite chibi-pet-${petState} ${reducedMotion ? "chibi-pet-reduced" : ""}`} data-facing={facingLeft ? "left" : "right"}>
              <motion.img
                src={sharmilaMascotSrc}
                alt=""
                draggable={false}
                className="relative z-10 block h-auto w-full select-none drop-shadow-[0_18px_16px_rgba(55,28,42,.24)]"
                style={{ transform: `scaleX(${facingLeft ? -1 : 1})` }}
              />
              <span className="pointer-events-none absolute -bottom-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-[50%] bg-[#5D344A]/20 blur-md" />
              <Sparkles className="pointer-events-none absolute right-0 top-[27%] z-20 h-4 w-4 text-[#C18B45] drop-shadow" />
              <span className="pointer-events-none absolute left-0 top-[42%] z-20 h-2 w-2 rounded-full bg-white/70 blur-[1px]" />
              {petState === "sleeping" && <span className="chibi-pet-zzz" aria-hidden="true">Z z z</span>}
              {petState === "curious" && <span className="chibi-pet-thought" aria-hidden="true">?</span>}
            </div>
            <span className="mt-1 flex items-center gap-1 rounded-full border border-white/90 bg-[#FFF9F4]/95 px-3 py-1.5 text-[10px] font-extrabold text-[#8B294B] shadow-[0_6px_20px_rgba(69,30,49,.16)]">
              <Sparkles size={11} />{mascot.label}
            </span>
            <span className="mt-1 text-[9px] font-semibold text-[#8B294B]/70 opacity-0 transition-opacity group-hover:opacity-100">drag · tap · right-click</span>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div data-pet-menu role="menu" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.96 }} className="absolute right-full top-1/3 mr-2 flex w-40 flex-col gap-1 rounded-2xl border border-[#E7B7B4] bg-[#FFF9F4] p-2 text-left shadow-[0_12px_36px_rgba(54,26,39,.22)]">
                <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#A43F60]">Nandhuuuu’s actions</p>
                {[
                  [roamingPaused ? "Resume roaming" : "Pause roaming", "pause"],
                  ["Follow cursor", "follow"], ["Walk around", "walk"],
                  ["Sit down", "sit"], ["Go to sleep", "sleep"],
                  ["Jump!", "jump"], ["Wake up", "wake"],
                ].map(([label, action]) => (
                  <button key={action} type="button" role="menuitem" onPointerDown={(event) => event.stopPropagation()} onClick={() => runPetAction(action as "pause" | "follow" | "walk" | "sit" | "sleep" | "jump" | "wake")} className="rounded-xl px-2 py-1.5 text-left text-[11px] font-semibold text-[#59313F] transition-colors hover:bg-[#F8E5E3]">{label}</button>
                ))}
                <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => setMenuOpen(false)} className="mt-1 rounded-xl bg-[#8B294B] px-2 py-1.5 text-[11px] font-bold text-white">Close menu</button>
              </motion.div>
            )}
          </AnimatePresence>
          {cursorNear && petState !== "dragging" && petState !== "sleeping" && (
            <span className="pointer-events-none absolute -top-2 right-1 text-[9px] text-[#A43F60]">♡</span>
          )}
        </div>
      )}
    </div>
  );
}
