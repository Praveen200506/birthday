"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSectionProps {
    images: string[];
}

const HeroSection = ({ images }: HeroSectionProps) => {
    const [configs, setConfigs] = useState<{
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
    }[]>([]);

    const [containerHeight, setContainerHeight] = useState(1000);
    const [particles, setParticles] = useState<
        { id: number; x: number; delay: number; duration: number }[]
    >([]);

    // 🧠 Mouse Parallax
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setMouse({
                x: (e.clientX / window.innerWidth - 0.5) * 10,
                y: (e.clientY / window.innerHeight - 0.5) * 10,
            });
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const cols = 4;
        const rowHeight = 380;

        const validSlots: { r: number; c: number }[] = [];
        let r = 0;

        while (validSlots.length < images.length) {
            for (let c = 0; c < cols; c++) {
                const isSafeZone = r < 2 && (c === 1 || c === 2);
                if (!isSafeZone) validSlots.push({ r, c });
            }
            if (validSlots.length < images.length) r++;
        }

        const shuffledImages = [...images].sort(() => 0.5 - Math.random());

        const newConfigs = shuffledImages.map((img, i) => {
            const slot = validSlots[i];
            const colWidth = 100 / cols;

            const jitterX = (Math.random() - 0.5) * 3;
            const jitterY = (Math.random() - 0.5) * 25;

            const left = slot.c * colWidth + colWidth / 2 - 10 + jitterX;
            const top = slot.r * rowHeight + rowHeight / 2 - 120 + jitterY;

            return {
                id: i,
                img,
                top: Math.max(30, top),
                left: Math.max(2, Math.min(90, left)),
                rotation: (Math.random() - 0.5) * 6,
                duration: 12 + Math.random() * 8,
                delay: Math.random() * 5,
                swayAngle: 2 + Math.random() * 1,
                tapeAngle: (Math.random() - 0.5) * 50,
                handwrittenText: ["❤️", "Memories", "Smile!", "xoxo", "Happy Day", "✨"][
                    Math.floor(Math.random() * 6)
                ],
                zIndex: Math.floor(Math.random() * 10),
            };
        });

        const maxTop = Math.max(...newConfigs.map((c) => c.top));
        setConfigs(newConfigs);
        setContainerHeight(maxTop + 450);

        const newParticles = Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 10,
        }));
        setParticles(newParticles);
    }, [images]);

    return (
        <section
            className="relative w-full overflow-x-hidden bg-gradient-to-b from-[#fdfbf7] via-[#fdf8f3] to-[#fdfbf7]"
            style={{ minHeight: "100vh", height: `${containerHeight}px` }}
        >
            {/* Paper Texture */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Floating Hearts & Sparkles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute text-pink-300/40 text-xl select-none"
                    style={{ left: `${particle.x}%`, top: 0 }}
                    animate={{
                        y: [0, containerHeight],
                        opacity: [0, 1, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {Math.random() > 0.5 ? "❤️" : "✨"}
                </motion.div>
            ))}

            {/* Main Text */}
            <div className="absolute top-0 left-0 w-full z-10 flex justify-center pt-32 pointer-events-none">
                <motion.div
                    className="text-center px-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-white/50 blur-3xl -z-10 rounded-full scale-[1.5]" />

                    <motion.h1
                        className="text-7xl md:text-9xl font-handwriting text-stone-800 mb-6 drop-shadow-2xl leading-tight tracking-wide"
                        animate={{
                            textShadow: [
                                "0px 4px 8px rgba(0,0,0,0.1)",
                                "0px 6px 16px rgba(0,0,0,0.15)",
                                "0px 4px 8px rgba(0,0,0,0.1)",
                            ],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        Happy Birthday <br />
                        <motion.span
                            className="text-mypink relative inline-block px-4"
                            animate={{
                                textShadow: [
                                    "0 0 15px rgba(255,105,180,0.5)",
                                    "0 0 30px rgba(255,105,180,0.8)",
                                    "0 0 15px rgba(255,105,180,0.5)",
                                ],
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            Sharmila
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-1 bg-mypink/40 rounded-full blur-[1px]"
                                animate={{ scaleX: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.span>
                    </motion.h1>

                    <motion.div
                        className="inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                    >
                        <p className="text-lg md:text-2xl font-sans text-stone-600 max-w-xl mx-auto font-light tracking-wide bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/60">
                            Every day feels brighter with you in my life. <br />
                            <span className="text-mypink font-medium">
                                To another year of magic ✨
                            </span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Photo Wall */}
            <div className="absolute inset-0 w-full h-full z-0">
                {configs.map((config) => (
                    <motion.div
                        key={config.id}
                        className="absolute"
                        style={{
                            left: `${config.left}%`,
                            top: `${config.top}px`,
                            zIndex: config.zIndex,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: config.delay * 0.1,
                            duration: 0.6,
                            ease: "easeOut",
                        }}
                    >
                        {/* Swing + Parallax */}
                        <motion.div
                            className="relative origin-top"
                            style={{
                                x: mouse.x * 0.8,
                                y: mouse.y * 0.8,
                            }}
                            initial={{ rotate: config.rotation }}
                            animate={{
                                rotate: [
                                    config.rotation - config.swayAngle,
                                    config.rotation + config.swayAngle,
                                    config.rotation - config.swayAngle,
                                ],
                            }}
                            transition={{
                                duration: config.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: config.delay,
                            }}
                        >
                            {/* Polaroid */}
                            <motion.div
                                className="bg-white p-3 pb-8 w-[180px] md:w-[220px] shadow-xl relative transition-all duration-500 hover:shadow-2xl"
                                whileHover={{
                                    scale: 1.08,
                                    zIndex: 50,
                                    rotate: 0,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                {/* Tape */}
                                <div
                                    className="absolute -top-3 left-1/2 w-10 h-4 bg-yellow-200/50 backdrop-blur-sm shadow-md z-10 border border-yellow-300/30"
                                    style={{
                                        transform: `translateX(-50%) rotate(${config.tapeAngle}deg)`,
                                    }}
                                />

                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={config.img}
                                        alt="Memory"
                                        width={300}
                                        height={400}
                                        className="object-cover w-full h-full"
                                    />

                                    {/* Vintage Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-900/10 mix-blend-overlay pointer-events-none" />

                                    {/* Light Sweep */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                                        animate={{ x: ["-120%", "120%"] }}
                                        transition={{
                                            duration: 6 + Math.random() * 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </div>

                                {/* Handwritten Note */}
                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                    <p className="font-handwriting text-gray-400 text-lg opacity-80">
                                        {config.handwrittenText}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
