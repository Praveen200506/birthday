"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Cake from "./Cake";

const SurpriseSection = () => {
    const [candlesOut, setCandlesOut] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleAllCandlesOut = () => {
        setCandlesOut(true);
        const duration = 240;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: ReturnType<typeof setInterval> = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        setTimeout(() => {
            setIsOpen(true);
        }, 1500);

        setTimeout(() => {
            window.dispatchEvent(new Event("final-scene"));
        }, 10000);
    };

    return (
        <section className="py-32 px-4 text-center bg-transparent flex flex-col items-center justify-center relative z-10">
            {!candlesOut ? (
                <Cake onAllCandlesOut={handleAllCandlesOut} />
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <h3 className="text-4xl font-handwriting text-mypink mb-4">A Wish Came True! ✨</h3>
                </motion.div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden border border-white/40"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-soft-pink via-lavender to-gold" />
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-soft-pink/20 rounded-full blur-3xl" />

                            <h4 className="text-4xl font-handwriting text-mypink mb-6">Happy Birthday! 🎂</h4>
                            <p className="text-xl font-handwriting text-gray-700 leading-relaxed">
                                &ldquo;May your day be as bright as your smile and as beautiful as your heart.&rdquo;
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-mypink text-white rounded-full font-sans text-sm shadow-lg shadow-pink-200"
                                >
                                    Thank You! ❤️
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default SurpriseSection;
