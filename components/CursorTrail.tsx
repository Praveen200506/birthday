"use client";

import { useEffect, useRef } from "react";

const CursorTrail = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const points: { x: number; y: number; life: number }[] = [];
        const maxLife = 30; // frames

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        const handleMouseMove = (e: MouseEvent) => {
            points.push({ x: e.clientX, y: e.clientY, life: maxLife });
            if (points.length > 20) points.shift();
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = points.length - 1; i >= 0; i--) {
                const p = points[i];
                p.life--;
                if (p.life <= 0) {
                    points.splice(i, 1);
                    continue;
                }
                const alpha = (p.life / maxLife) * 0.4;
                const radius = (p.life / maxLife) * 4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 183, 178, ${alpha})`;
                ctx.fill();
            }
            animId = requestAnimationFrame(draw);
        };
        animId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999 }}
        />
    );
};

export default CursorTrail;
