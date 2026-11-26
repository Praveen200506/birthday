"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Music, VolumeX, SkipForward } from "lucide-react";
import { getAssetUrl } from "@/lib/assets";

const SONGS = {
  home: { urls: [getAssetUrl("music/hero.mp3")], label: "Happy Birthday Music" },
  memories: { urls: [getAssetUrl("music/memories.mp3")], label: "Nostalgic Memories" },
  letter: { urls: [getAssetUrl("music/memories.mp3")], label: "Heartfelt Piano" },
  surprise: { urls: [getAssetUrl("music/surprise.mp3")], label: "Celebration Dance!" },
  blog: { urls: [getAssetUrl("music/blog.mpeg")], label: "Blog Music" },
} as const;
type Category = keyof typeof SONGS;

function categoryForPath(pathname: string): Category {
  if (pathname.includes("memories")) return "memories";
  if (pathname.includes("letter")) return "letter";
  if (pathname.includes("surprise")) return "surprise";
  if (pathname.includes("blog")) return "blog";
  return "home";
}

export default function AudioPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState<Category>(() => categoryForPath(pathname));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const playlist = SONGS[category].urls;

  useEffect(() => {
    const nextCategory = categoryForPath(pathname);
    setCategory(nextCategory);
    setCurrentIndex(0);
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [pathname]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    if (!userInteracted) return;
    void audio.play().catch(() => setIsPlaying(false));
  }, [category, currentIndex, userInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setUserInteracted(true);
    if (audio.paused) void audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  };
  const nextSong = () => setCurrentIndex((index) => (index + 1) % playlist.length);

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center sm:right-4 sm:top-4 md:bottom-7 md:right-6 md:top-auto">
      <audio ref={audioRef} src={playlist[currentIndex]} preload="none" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={nextSong} onError={() => setIsPlaying(false)} />
      <motion.div
        initial={reduceMotion ? false : { y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-2 rounded-full border-2 border-[#E6B6B4] bg-[#FFF9F4]/95 px-3 py-2 shadow-[0_8px_28px_rgba(102,43,61,0.18)] backdrop-blur-xl xs:gap-3 md:gap-4 md:px-5 md:py-2.5"
      >
        <div className="flex h-4 items-end gap-[2px] md:h-5" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i} className="w-[3px] rounded-full bg-[#D64F75]"
              animate={isPlaying && !reduceMotion ? { height: [3, 14, 6, 18, 3] } : { height: 3 }}
              transition={{ duration: 0.65, repeat: isPlaying && !reduceMotion ? Infinity : 0, delay: i * 0.1 }} />
          ))}
        </div>
        <div className="hidden flex-col text-left xs:flex">
          <span className="text-[8px] font-bold uppercase leading-none tracking-wider text-[#76515D] md:text-[9px]">Now Playing</span>
          <span className="max-w-[80px] truncate font-semibold leading-tight text-[#8B294B] sm:max-w-[120px] md:text-sm">{SONGS[category].label}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause music" : "Play music"}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#542638] bg-[#8B294B] text-white shadow-md transition hover:scale-105 hover:bg-[#542638] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#8B294B] md:h-10 md:w-10">
            {isPlaying ? <Music size={16} /> : <VolumeX size={16} />}
          </button>
          <button type="button" onClick={nextSong} aria-label="Next song"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C98A9B] bg-white text-[#762D49] shadow-sm transition hover:bg-[#FCE5E8] hover:text-[#542638] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B294B]">
            <SkipForward size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
