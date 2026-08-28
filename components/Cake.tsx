"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const CELEBRATION_PARTICLES = [
    { x: -120, y: -150, color: '#FFD700' },
    { x: 140, y: -160, color: '#FF69B4' },
    { x: -80, y: 120, color: '#00BFFF' },
    { x: 90, y: 130, color: '#32CD32' },
    { x: -160, y: -60, color: '#FFD700' },
    { x: 170, y: -40, color: '#FF69B4' },
    { x: -130, y: 80, color: '#00BFFF' },
    { x: 120, y: 70, color: '#32CD32' },
    { x: -50, y: -180, color: '#FFD700' },
    { x: 60, y: -190, color: '#FF69B4' },
    { x: -180, y: 30, color: '#00BFFF' },
    { x: 190, y: 20, color: '#32CD32' },
];

interface CakeProps {
    onAllCandlesOut: () => void;
}

const Cake = ({ onAllCandlesOut }: CakeProps) => {
    const [candles, setCandles] = useState([true, true, true, true, true]);
    const [celebrate, setCelebrate] = useState(false);
    const [flameflickers, setFlameFlickers] = useState<number[]>([]);

    useEffect(() => {
        // Generate stable random values for animations on client-side only
        setFlameFlickers([0.4, 0.7, 0.2, 0.9, 0.5]);
    }, []);

    const blowCandle = (index: number) => {
        const newCandles = [...candles];
        newCandles[index] = false;
        setCandles(newCandles);

        if (newCandles.every((c) => !c)) {
            setCelebrate(true);
            setTimeout(onAllCandlesOut, 1500);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center py-10 sm:py-20 px-2 max-w-full">
            {/* Celebration Effects */}
            <AnimatePresence>
                {celebrate && (
                    <motion.div className="absolute inset-0 pointer-events-none">
                        {CELEBRATION_PARTICLES.map((particle, i) => (
                            <motion.div
                                key={i}
                                className="absolute left-1/2 top-1/2 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full"
                                style={{ backgroundColor: particle.color }}
                                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                                animate={{
                                    opacity: 0,
                                    x: particle.x * 0.8,
                                    y: particle.y * 0.8,
                                    scale: 1.5
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Candles Container */}
            <div className="relative flex gap-3 xs:gap-4 sm:gap-6 z-20 -mb-3 sm:-mb-4">
                {candles.map((isOn, i) => (
                    <motion.div
                        key={i}
                        className="relative cursor-pointer group"
                        onClick={() => isOn && blowCandle(i)}
                        whileHover={{ scale: isOn ? 1.1 : 1 }}
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                        {/* Flame */}
                        <AnimatePresence>
                            {isOn && (
                                <motion.div
                                    className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-3.5 sm:w-4 h-5 sm:h-6 origin-bottom"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [-2, 2, -2],
                                        filter: ["blur(0.5px)", "blur(1px)", "blur(0.5px)"]
                                    }}
                                    transition={{
                                        duration: 0.1 + (flameflickers[i] || 0) * 0.2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    {/* Inner Flame */}
                                    <div className="w-full h-full bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_10px_orange]" />
                                    {/* Outer Glow */}
                                    <div className="absolute inset-0 bg-orange-400 blur-md opacity-50 animate-pulse" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Wick */}
                        <div className="w-1 h-2.5 sm:h-3 bg-gray-800 mx-auto -mb-1 relative z-10" />

                        {/* Candle Stick */}
                        <div
                            className="w-3 xs:w-3.5 sm:w-4 h-12 xs:h-14 sm:h-16 rounded-xs sm:rounded-sm shadow-md relative overflow-hidden"
                            style={{
                                background: `repeating-linear-gradient(
                                    45deg,
                                    ${i % 2 ? '#ff9a9e' : '#a18cd1'},
                                    ${i % 2 ? '#ff9a9e' : '#a18cd1'} 10px,
                                    ${i % 2 ? '#fecfef' : '#fbc2eb'} 10px,
                                    ${i % 2 ? '#fecfef' : '#fbc2eb'} 20px
                                )`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cake Structure */}
            <div className="relative flex flex-col items-center">
                {/* Top Frosting Layer */}
                <motion.div
                    className="w-40 xs:w-48 sm:w-52 h-12 xs:h-14 sm:h-16 bg-gradient-to-b from-white to-pink-50 rounded-t-xl sm:rounded-t-2xl shadow-lg z-10 relative overflow-hidden flex justify-center items-end"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                >
                    {/* Drips */}
                    <div className="absolute -bottom-2 w-full flex justify-between px-2">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="w-4 sm:w-6 h-6 sm:h-8 bg-pink-50 rounded-b-full shadow-xs" />
                        ))}
                    </div>
                    {/* Sprinkles */}
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ff69b4_2px,transparent_2px)] [background-size:16px_16px]" />
                </motion.div>

                {/* Middle Cake Layer */}
                <motion.div
                    className="w-52 xs:w-60 sm:w-64 h-14 xs:h-16 sm:h-20 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 rounded-lg shadow-inner z-0 -mt-2 relative flex items-center justify-center border-t border-white/40"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <div className="w-full h-3 sm:h-4 bg-white/30 skew-y-1 backdrop-blur-xs" />
                </motion.div>

                {/* Bottom Cake Layer */}
                <motion.div
                    className="w-64 xs:w-72 sm:w-80 h-18 xs:h-20 sm:h-24 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded-b-2xl sm:rounded-b-3xl shadow-xl -mt-2 relative border-t border-white/30 overflow-hidden"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                >
                    {/* Decorative Wave */}
                    <div className="absolute bottom-0 w-full h-6 sm:h-8 bg-white/20 blur-xl" />
                </motion.div>

                {/* Cake Plate / Shadow */}
                <motion.div
                    className="w-68 xs:w-76 sm:w-96 max-w-[90vw] h-3 sm:h-4 bg-stone-300/40 rounded-[50%] blur-xs mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                />
            </div>

            {/* Instruction / Message */}
            <motion.p
                className="mt-8 sm:mt-12 font-handwriting text-xl sm:text-2xl text-mypink drop-shadow-xs px-4 text-center"
                animate={{
                    opacity: [0.75, 1, 0.75],
                    y: [0, -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                {candles.some((c) => c)
                    ? "Make a wish & blow the candles! 🎂"
                    : "Wishes do come true! ✨"}
            </motion.p>
        </div>
    );
};

export default Cake;
