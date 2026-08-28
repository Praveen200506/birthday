"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Feather, KeyRound, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/blog/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/blog/write");
        router.refresh();
      } else {
        setError(data.message || "Invalid author password.");
        setPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-warm-cream/50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/80 relative overflow-hidden"
      >
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-mypink/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-mypink/15 text-mypink flex items-center justify-center mb-4 shadow-inner">
            <Feather size={28} />
          </div>

          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-mypink font-medium mb-1">
            <KeyRound size={13} />
            <span>Author Portal</span>
          </div>

          <h1 className="text-3xl font-handwriting text-stone-800 mb-2">
            Writer&apos;s Desk
          </h1>
          <p className="text-xs text-stone-500 mb-6 max-w-xs leading-relaxed">
            Enter your author password to compose, edit, and manage journal stories.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Author Password"
                className="w-full bg-stone-50 border border-stone-200/80 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mypink/40 focus:border-mypink text-stone-800 text-sm placeholder:text-stone-400 transition-all font-sans"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-medium"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className={`w-full py-3.5 rounded-2xl font-medium text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                password.trim() && !loading
                  ? "bg-mypink hover:bg-pink-400 text-white shadow-pink-200 cursor-pointer"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Enter Desk</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 w-full flex items-center justify-between text-xs text-stone-400">
            <Link href="/blog" className="hover:text-mypink transition-colors">
              ← Return to Journal
            </Link>
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-mypink" />
              Private Author Zone
            </span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
