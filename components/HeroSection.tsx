"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";

interface HeroSectionProps {
    images: string[];
}

interface PolaroidConfig {
    id: number;
    img: string;
    top: number;
    left: number;
    rotation: number;
    duration: number;
    delay: number;
    swayAngle: number;
    tapeAngle: number;
    handwrittenText: string;
    zIndex: number;
    lightDuration: number;
}

const HANDWRITTEN_TEXTS = ["❤️", "Memories", "Smile!", "xoxo", "Happy Day", "✨", "Cherish"];

// Deterministic pseudo-random helper to avoid layout thrashing on re-renders
function pseudoRandom(seed: number): number {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
}

const HeroSection = ({ images }: HeroSectionProps) => {
    const [configs, setConfigs] = useState<PolaroidConfig[]>([]);
    const [containerHeight, setContainerHeight] = useState(1200);

    // 🧠 Framer Motion GPU Parallax (No React state re-renders on mousemove!)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
    const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 8;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Deterministic particles generated once
    const particles = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: (pseudoRandom(i * 3 + 1) * 94 + 3).toFixed(2),
            delay: (pseudoRandom(i * 5 + 2) * 6).toFixed(2),
            duration: (16 + pseudoRandom(i * 7 + 3) * 8).toFixed(2),
            icon: pseudoRandom(i * 9 + 4) > 0.5 ? "❤️" : "✨",
        }));
    }, []);

    const generateLayout = useCallback(() => {
        if (!images || images.length === 0) return;

        const isMobile = window.innerWidth < 768;
        const isSmallPhone = window.innerWidth < 400;

        const cols = isMobile ? 2 : 4;
        const rowHeight = isMobile ? 280 : 380;
        const initialTopOffset = isMobile ? 420 : 160;

        const validSlots: { r: number; c: number }[] = [];
        let r = 0;

        while (validSlots.length < images.length) {
            for (let c = 0; c < cols; c++) {
                if (!isMobile) {
                    const isSafeZone = r < 2 && (c === 1 || c === 2);
                    if (!isSafeZone) validSlots.push({ r, c });
                } else {
                    validSlots.push({ r, c });
                }
            }
            if (validSlots.length < images.length) r++;
        }

        const newConfigs: PolaroidConfig[] = images.map((img, i) => {
            const slot = validSlots[i] || { r: Math.floor(i / cols), c: i % cols };
            const colWidth = 100 / cols;

            const jitterX = isMobile
                ? (pseudoRandom(i * 11 + 1) - 0.5) * 4
                : (pseudoRandom(i * 11 + 1) - 0.5) * 6;
            const jitterY = (pseudoRandom(i * 13 + 2) - 0.5) * (isMobile ? 20 : 30);

            let left: number;
            if (isMobile) {
                const baseLeft = slot.c === 0 ? 5 : 52;
                left = baseLeft + jitterX;
                left = Math.max(3, Math.min(left, slot.c === 0 ? 12 : 58));
            } else {
                left = slot.c * colWidth + colWidth / 2 - 8 + jitterX;
                left = Math.max(3, Math.min(88, left));
            }

            const top = initialTopOffset + slot.r * rowHeight + jitterY;

            return {
                id: i,
                img,
                top: Math.max(initialTopOffset - 60, top),
                left: isSmallPhone ? (slot.c === 0 ? 3 : 52) : left,
                rotation: (pseudoRandom(i * 17 + 3) - 0.5) * (isMobile ? 8 : 10),
                duration: 10 + pseudoRandom(i * 19 + 4) * 6,
                delay: pseudoRandom(i * 23 + 5) * 3,
                swayAngle: 1.5 + pseudoRandom(i * 29 + 6) * 1.5,
                tapeAngle: (pseudoRandom(i * 31 + 7) - 0.5) * 40,
                handwrittenText: HANDWRITTEN_TEXTS[Math.floor(pseudoRandom(i * 37 + 8) * HANDWRITTEN_TEXTS.length)],
                zIndex: Math.floor(pseudoRandom(i * 41 + 9) * 10),
                lightDuration: 6 + pseudoRandom(i * 43 + 10) * 4,
            };
        });

        const maxTop = Math.max(...newConfigs.map((c) => c.top));
        setConfigs(newConfigs);
        setContainerHeight(maxTop + (isMobile ? 320 : 420));
    }, [images]);

    useEffect(() => {
        generateLayout();

        let lastWidth = window.innerWidth;
        let resizeTimer: ReturnType<typeof setTimeout>;

        const handleResize = () => {
            // Only recompute if width actually changed (preventing height-only scrollbar resize loop)
            if (Math.abs(window.innerWidth - lastWidth) > 20) {
                lastWidth = window.innerWidth;
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(generateLayout, 200);
            }
        };

        window.addEventListener("resize", handleResize, { passive: true });
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, [generateLayout]);

    return (
        <section
            className="relative w-full max-w-full overflow-x-hidden bg-gradient-to-b from-[#FFFBF7] via-[#FFF5F7] to-[#FFFBF7]"
            style={{ minHeight: "100dvh", height: `${containerHeight}px` }}
        >
            {/* Floating Hearts & Sparkles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute text-pink-300/50 text-base sm:text-xl select-none pointer-events-none"
                    style={{ left: `${particle.x}%`, top: 0 }}
                    animate={{
                        y: [0, containerHeight],
                        opacity: [0, 0.85, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: Number(particle.duration),
                        delay: Number(particle.delay),
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {particle.icon}
                </motion.div>
            ))}

            {/* Main Title & Hero Message */}
            <div className="absolute top-0 left-0 w-full z-20 flex justify-center pt-20 xs:pt-24 sm:pt-28 md:pt-32 px-3 pointer-events-none">
                <motion.div
                    className="text-center w-full max-w-2xl px-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="font-handwriting text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-stone-800 tracking-wide leading-tight mb-2 sm:mb-4 select-none">
                        Happy Birthday <br />
                        <span className="text-pink-500 font-bold inline-block mt-1">
                            Sharmila ✨
                        </span>
                    </h1>

                    <motion.div
                        className="inline-block w-full max-w-lg mt-1 sm:mt-2 pointer-events-auto"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <p className="text-sm xs:text-base sm:text-lg font-sans text-stone-600 font-normal tracking-wide bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-md border border-white/80 leading-relaxed">
                            Every day feels brighter with you in my life. <br />
                            <span className="text-pink-500 font-semibold">
                                To another year of magic ✨
                            </span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Photo Wall */}
            <div className="absolute inset-0 w-full h-full z-10">
                {configs.map((config) => (
                    <div
                        key={config.img}
                        className="absolute"
                        style={{
                            left: `${config.left}%`,
                            top: `${config.top}px`,
                            zIndex: config.zIndex,
                        }}
                    >
                        {/* Swing + GPU Parallax */}
                        <motion.div
                            className="relative origin-top"
                            style={{
                                x: smoothX,
                                y: smoothY,
                            }}
                            initial={{ rotate: config.rotation, opacity: 0 }}
                            animate={{
                                opacity: 1,
                                rotate: [
                                    config.rotation - config.swayAngle,
                                    config.rotation + config.swayAngle,
                                    config.rotation - config.swayAngle,
                                ],
                            }}
                            transition={{
                                opacity: { duration: 0.6, delay: config.delay * 0.1 },
                                rotate: {
                                    duration: config.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: config.delay,
                                },
                            }}
                        >
                            {/* Polaroid Container */}
                            <motion.div
                                className="bg-white p-2 xs:p-2.5 sm:p-3 pb-6 xs:pb-7 sm:pb-8 w-[135px] xs:w-[155px] sm:w-[190px] md:w-[220px] shadow-lg sm:shadow-xl relative transition-shadow duration-300 hover:shadow-2xl rounded-xs"
                                whileHover={{
                                    scale: 1.06,
                                    zIndex: 30,
                                    rotate: 0,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                {/* Washi Tape */}
                                <div
                                    className="absolute -top-2.5 left-1/2 w-8 xs:w-10 h-3.5 xs:h-4 bg-yellow-200/60 backdrop-blur-xs shadow-xs z-10 border border-yellow-300/40"
                                    style={{
                                        transform: `translateX(-50%) rotate(${config.tapeAngle}deg)`,
                                    }}
                                />

                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 rounded-[2px]">
                                    <Image
                                        src={config.img}
                                        alt="Memory"
                                        width={300}
                                        height={400}
                                        className="object-cover w-full h-full"
                                        loading={config.id < 4 ? "eager" : "lazy"}
                                        sizes="(max-width: 400px) 135px, (max-width: 768px) 155px, (max-width: 1024px) 190px, 220px"
                                    />

                                    {/* Vintage Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-900/10 mix-blend-overlay pointer-events-none" />
                                </div>

                                {/* Handwritten Note */}
                                <div className="absolute bottom-1.5 xs:bottom-2 left-0 right-0 text-center">
                                    <p className="font-handwriting text-stone-400 text-sm xs:text-base sm:text-lg opacity-85 select-none">
                                        {config.handwrittenText}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
