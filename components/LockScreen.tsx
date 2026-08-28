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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-50/90 backdrop-blur-xl"
        >
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-rose-100/50 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        animate={{
                            scale: isUnlocked ? 1.2 : 1,
                            rotate: isUnlocked ? [0, -10, 10, 0] : 0
                        }}
                        transition={{
                            scale: { type: "spring", stiffness: 300, damping: 20 },
                            rotate: { duration: 0.5, ease: "easeInOut" }
                        }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${isUnlocked ? "bg-green-100 text-green-500" : error ? "bg-red-100 text-red-500" : "bg-rose-100 text-rose-500"
                            }`}
                    >
                        {isUnlocked ? (
                            <Unlock size={40} />
                        ) : (
                            <Lock size={40} />
                        )}
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif text-center">
                        {isUnlocked ? "Unlocked!" : "Locked"}
                    </h2>
                    <p className="text-gray-500 text-sm mb-8 text-center">
                        {isUnlocked ? "Welcome to the celebration" : "Enter the special year to enter"}
                    </p>

                    {!isUnlocked && (
                        <form onSubmit={handleSubmit} className="w-full relative">
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="The Date we met? (DDMM)"
                                className="w-full bg-gray-50 border border-gray-200 text-center text-2xl tracking-[0.5em] py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-gray-700 placeholder:text-gray-300 placeholder:text-sm placeholder:tracking-normal transition-all"
                                autoFocus
                                maxLength={4}
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 bg-rose-500 text-white p-2.5 rounded-lg shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
                            >
                                <ArrowRight size={20} />
                            </motion.button>
                        </form>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-4 font-medium"
                        >
                            Incorrect code. Try again.
                        </motion.p>
                    )}

                    <div className="mt-8 flex items-center gap-2 text-rose-300 text-sm">
                        <Heart size={14} className="fill-rose-300" />
                        <span>Made with love</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
