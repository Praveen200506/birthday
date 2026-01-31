"use client";

import { useState, useEffect } from "react";
import LockScreen from "./LockScreen";
import { AnimatePresence, motion } from "framer-motion";

export default function GlobalLockWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLocked, setIsLocked] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check session storage to persist unlock status across refreshes/navigation
        const unlocked = sessionStorage.getItem("isUnlocked");
        if (unlocked === "true") setIsLocked(false);
    }, []);

    const handleUnlock = () => {
        setIsLocked(false);
        sessionStorage.setItem("isUnlocked", "true");
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <>
            <AnimatePresence>
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100]"
                    >
                        <LockScreen onUnlock={handleUnlock} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={isLocked ? "fixed inset-0 overflow-hidden pointer-events-none filter blur-sm" : "contents"}>
                {children}
            </div>
        </>
    );
}
