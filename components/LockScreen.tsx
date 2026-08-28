"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, ArrowRight, Heart } from "lucide-react";

interface LockScreenProps {
    onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Hardcoded secret code - fairly simple for a birthday app
    // You can change this to anything you want
    const SECRET_CODE = "1910";

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (code === SECRET_CODE) {
            setIsUnlocked(true);
            setTimeout(() => {
                onUnlock();
            }, 800); // Wait for unlock animation
        } else {
            setError(true);
            setCode("");
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-50/90 backdrop-blur-xl p-4"
        >
            <div className="bg-white/95 backdrop-blur-xl p-6 xs:p-8 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs xs:max-w-sm border border-rose-100/60 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        animate={{
                            scale: isUnlocked ? 1.15 : 1,
                            rotate: isUnlocked ? [0, -10, 10, 0] : 0
                        }}
                        transition={{
                            scale: { type: "spring", stiffness: 300, damping: 20 },
                            rotate: { duration: 0.5, ease: "easeInOut" }
                        }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-500 shadow-inner ${
                            isUnlocked ? "bg-green-100 text-green-500" : error ? "bg-red-100 text-red-500" : "bg-rose-100 text-rose-500"
                        }`}
                    >
                        {isUnlocked ? (
                            <Unlock size={32} className="sm:w-10 sm:h-10" />
                        ) : (
                            <Lock size={30} className="sm:w-10 sm:h-10" />
                        )}
                    </motion.div>

                    <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-1.5 font-serif text-center">
                        {isUnlocked ? "Unlocked!" : "Locked"}
                    </h2>
                    <p className="text-stone-500 text-xs sm:text-sm mb-6 sm:mb-8 text-center leading-relaxed">
                        {isUnlocked ? "Welcome to the celebration ✨" : "Enter the special date to enter (DDMM)"}
                    </p>

                    {!isUnlocked && (
                        <form onSubmit={handleSubmit} className="w-full relative">
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="DDMM"
                                className="w-full bg-stone-50 border border-stone-200 text-center text-xl sm:text-2xl tracking-[0.3em] sm:tracking-[0.4em] py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-stone-700 placeholder:text-stone-300 placeholder:text-xs placeholder:tracking-normal transition-all"
                                autoFocus
                                maxLength={4}
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                aria-label="Unlock"
                                className="absolute right-2 top-2 bottom-2 bg-rose-500 hover:bg-rose-600 text-white px-3 rounded-lg sm:rounded-xl shadow-md shadow-rose-200 transition-colors flex items-center justify-center"
                            >
                                <ArrowRight size={18} />
                            </motion.button>
                        </form>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-3.5 font-medium text-center"
                        >
                            Incorrect code. Try again.
                        </motion.p>
                    )}

                    <div className="mt-6 sm:mt-8 flex items-center gap-1.5 text-rose-300 text-xs">
                        <Heart size={13} className="fill-rose-300" />
                        <span>Made with love</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
