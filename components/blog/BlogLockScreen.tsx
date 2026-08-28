"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowRight, BookHeart, Sparkles } from "lucide-react";

interface BlogLockScreenProps {
  onUnlock: () => void;
}

export default function BlogLockScreen({ onUnlock }: BlogLockScreenProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length !== 4 || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/blog/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setTimeout(() => {
          onUnlock();
        }, 700);
      } else {
        setError(data.message || "Incorrect PIN. Try again.");
        setPin("");
      }
    } catch {
      setError("Connection error. Please try again.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

    return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-[75vh] flex flex-col items-center justify-center p-3 xs:p-4"
    >
      <div className="bg-white/90 backdrop-blur-2xl p-6 xs:p-8 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-2xl w-full max-w-xs xs:max-w-sm border border-white/70 relative overflow-hidden text-center mx-auto">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-mypink/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-lavender/40 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Lock Icon */}
          <motion.div
            animate={{
              scale: isUnlocked ? 1.15 : 1,
              rotate: isUnlocked ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              rotate: { duration: 0.5 },
            }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-5 transition-colors duration-500 shadow-inner ${
              isUnlocked
                ? "bg-green-100 text-green-600"
                : error
                ? "bg-red-100 text-red-500"
                : "bg-gradient-to-tr from-mypink/20 to-soft-pink/40 text-mypink"
            }`}
          >
            {isUnlocked ? <Unlock size={32} className="sm:w-9 sm:h-9" /> : <Lock size={30} className="sm:w-9 sm:h-9" />}
          </motion.div>

          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-mypink font-medium mb-1">
            <BookHeart size={13} />
            <span>Private Journal</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-handwriting text-stone-800 mb-1.5">
            {isUnlocked ? "Opening Journal..." : "Stories & Reflections"}
          </h2>

          <p className="text-stone-500 text-xs sm:text-sm mb-5 sm:mb-6 max-w-[240px] leading-relaxed">
            {isUnlocked
              ? "Welcome to our collection of thoughts ✨"
              : "Enter your birthday to enter (DDMM)"}
          </p>

          {!isUnlocked && (
            <form onSubmit={handleSubmit} className="w-full relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ""));
                  if (error) setError(null);
                }}
                placeholder="DDMM"
                className="w-full bg-stone-50/90 border border-stone-200 text-center text-lg sm:text-xl tracking-[0.3em] sm:tracking-[0.4em] py-3 sm:py-3.5 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-mypink/50 focus:border-mypink text-stone-700 placeholder:text-stone-300 placeholder:text-xs placeholder:tracking-normal transition-all font-mono"
                autoFocus
                disabled={loading}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                aria-label="Unlock Journal"
                disabled={loading || pin.length !== 4}
                className={`absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 px-3 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                  pin.length === 4 && !loading
                    ? "bg-mypink text-white shadow-md shadow-pink-200 cursor-pointer hover:bg-pink-400"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <ArrowRight size={18} />
                )}
              </motion.button>
            </form>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs mt-3 font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 sm:mt-7 flex items-center gap-1.5 text-stone-400 text-xs">
            <Sparkles size={13} className="text-mypink" />
            <span>A quiet space for our memories</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
