"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
        <div className="fixed bottom-10 right-10 z-[100] flex items-center">
            <audio
                ref={audioRef}
                src={currentPlaylist[currentIndex]}
                onEnded={nextSong}
                autoPlay={userInteracted}
                loop={currentPlaylist.length === 1}
            />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/40 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6"
            >
                {/* Visualizer */}
                <div className="flex items-end gap-[2px] h-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1 bg-mypink"
                            animate={{
                                height: isPlaying ? [4, 16, 8, 20, 4] : 4,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-sans">Now Playing</span>
                    <span className="text-sm font-handwriting text-mypink truncate max-w-[120px]">
                        {Object.values(SONGS).find(s => s.urls.includes(currentPlaylist[0]))?.label || "Birthday Tune"}
                    </span>
                </div>

                <div className="flex items-center gap-3 ml-2">
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-mypink text-white shadow-md hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
                    </button>

                    <button
                        onClick={nextSong}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 text-mypink hover:bg-white transition-colors"
                    >
                        <SkipForward size={14} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AudioPlayer;
