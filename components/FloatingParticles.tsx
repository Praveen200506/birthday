"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const FloatingParticles = () => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 10,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute text-soft-pink/20"
                        initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0 }}
                        animate={{
                            y: "-10vh",
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "linear",
                        }}
                        style={{ fontSize: p.size }}
                    >
                        {p.id % 2 === 0 ? "❤️" : "✨"}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FloatingParticles;
