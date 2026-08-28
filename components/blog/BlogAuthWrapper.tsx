"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogLockScreen from "./BlogLockScreen";

interface BlogAuthWrapperProps {
  children: React.ReactNode;
}

export default function BlogAuthWrapper({ children }: BlogAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/blog/auth")
      .then((res) => res.json())
      .then((data) => {
        if (active) setIsAuthenticated(Boolean(data?.authenticated));
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-10 h-10 rounded-full bg-mypink/30 flex items-center justify-center text-mypink text-xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <BlogLockScreen onUnlock={() => setIsAuthenticated(true)} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
