"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Music, VolumeX, SkipForward } from "lucide-react";

// Default fallbacks in case local files aren't there
const SONGS = {
    home: {
        urls: ["/music/hero.mp3"],
        label: "Happy Birthday Music"
    },
    memories: {
        urls: ["/music/memories.mp3"],
        label: "Nostalgic Memories"
    },
    letter: {
        urls: ["/music/memories.mp3"],
        label: "Heartfelt Piano"
    },
    surprise: {
        urls: ["/music/surprise.mp3"],
        label: "Celebration Dance!"
    },
    blog: {
        urls: ["/music/memories.mp3"],
        label: "Nostalgic Memories"
    }
};

const AudioPlayer = () => {
    const pathname = usePathname();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        let category: keyof typeof SONGS = "home";
        if (pathname.includes("memories")) category = "memories";
        else if (pathname.includes("letter")) category = "letter";
        else if (pathname.includes("surprise")) category = "surprise";
        else if (pathname.includes("blog")) category = "blog";

        const newPlaylist = SONGS[category].urls;
        setCurrentPlaylist(newPlaylist);
        setCurrentIndex(0);

        if (userInteracted && audioRef.current) {
            setTimeout(() => {
                audioRef.current?.play().catch(() => { });
                setIsPlaying(true);
            }, 100);
        }
    }, [pathname]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        setUserInteracted(true);
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        setCurrentIndex((prev: number) => (prev + 1) % currentPlaylist.length);
    };

    return (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-auto md:bottom-7 md:right-6 z-40 flex items-center">
            <audio
                ref={audioRef}
                src={currentPlaylist[currentIndex]}
                onEnded={nextSong}
                autoPlay={userInteracted}
                loop={currentPlaylist.length === 1}
            />

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/85 backdrop-blur-xl border border-white/70 px-3 xs:px-4 md:px-5 py-1.5 md:py-2.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 xs:gap-3 md:gap-4 transition-all"
            >
                {/* Visualizer */}
                <div className="flex items-end gap-[2px] h-4 md:h-5">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            className="w-[2.5px] md:w-1 bg-mypink rounded-full"
                            animate={{
                                height: isPlaying ? [3, 14, 6, 18, 3] : 3,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>

                <div className="hidden xs:flex flex-col text-left">
                    <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-stone-400 font-sans leading-none">
                        Now Playing
                    </span>
                    <span className="text-xs md:text-sm font-handwriting text-mypink truncate max-w-[80px] sm:max-w-[120px] leading-tight">
                        {Object.values(SONGS).find((s) => s.urls.includes(currentPlaylist[0]))?.label || "Birthday Tune"}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause music" : "Play music"}
                        className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-mypink text-white shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                        {isPlaying ? <Music size={13} className="md:w-4 md:h-4" /> : <VolumeX size={13} className="md:w-4 md:h-4" />}
                    </button>

                    <button
                        onClick={nextSong}
                        aria-label="Next song"
                        className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-white text-mypink hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                        <SkipForward size={11} className="md:w-3 md:h-3" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AudioPlayer;
