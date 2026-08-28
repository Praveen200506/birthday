"use client";

import { useMemo } from "react";

const FloatingParticles = () => {
    // Generate particles once with deterministic positions
    const particles = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            x: ((Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1 * 100 + 100) % 100,
            size: 10 + (i % 5) * 4,
            duration: 12 + (i % 7) * 3,
            delay: (i % 5) * 2,
            emoji: i % 2 === 0 ? "❤️" : "✨",
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute text-soft-pink/20 floating-particle"
                    style={{
                        left: `${p.x}vw`,
                        fontSize: p.size,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                >
                    {p.emoji}
                </div>
            ))}
        </div>
    );
};

export default FloatingParticles;
