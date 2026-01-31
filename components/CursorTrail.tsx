"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CursorTrail = () => {
    const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() };
            setPoints((prev) => [...prev.slice(-15), newPoint]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <AnimatePresence>
                {points.map((p, i) => (
                    <motion.div
                        key={p.id}
                        className="absolute w-2 h-2 bg-mypink/40 rounded-full blur-[1px]"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ left: p.x, top: p.y }}
                        transition={{ duration: 0.5 }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default CursorTrail;
