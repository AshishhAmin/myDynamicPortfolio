import React, { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * AnimatedBackground – Minimal & Futuristic
 * ──────────────────────────────────────────
 * Light (#FAFAFA) base. A subtle grid + soft particle field behind ALL content.
 * z-index is -10, so it never overlaps content.
 * Fewer particles (40 desktop / 20 mobile), very low opacity — purely atmospheric.
 */
const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const { scrollYProgress } = useScroll();
    const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf, W = 0, H = 0;

        const mobile = () => window.innerWidth < 768;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
        const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);

        /* Colour pool — muted blue / indigo only */
        const COLOURS = ['rgba(37,99,235,', 'rgba(99,102,241,', 'rgba(56,189,248,'];

        const n = mobile() ? 20 : 40;
        const CONN = mobile() ? 100 : 130;

        const pts = Array.from({ length: n }, () => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.13,
            r: Math.random() * 1.6 + 0.8,
            col: COLOURS[Math.floor(Math.random() * COLOURS.length)],
            a: Math.random() * 0.18 + 0.06,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.012 + 0.005,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const mx = mouseRef.current.x, my = mouseRef.current.y;

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];

                /* Gentle mouse repel */
                const dx = p.x * W - mx, dy = p.y * H - my;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 80) {
                    const f = (80 - d) / 80 * 0.25;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }

                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x += p.vx / W;
                p.y += p.vy / H;
                if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
                if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

                p.phase += p.speed;
                const alpha = p.a + Math.sin(p.phase) * 0.06;

                /* Connections */
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const ddx = (p.x - q.x) * W, ddy = (p.y - q.y) * H;
                    const dd = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dd < CONN) {
                        const la = (1 - dd / CONN) * 0.10;
                        ctx.save();
                        ctx.strokeStyle = p.col + la + ')';
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p.x * W, p.y * H);
                        ctx.lineTo(q.x * W, q.y * H);
                        ctx.stroke();
                        ctx.restore();
                    }
                }

                /* Node */
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.col + (alpha + 0.15) + ')';
                ctx.beginPath();
                ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            raf = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
            style={{ background: '#FAFAFA' }}
        >
            {/* Particle canvas — stays behind everything */}
            <motion.canvas
                ref={canvasRef}
                style={{ y: canvasY, willChange: 'transform' }}
                className="absolute inset-0 w-full h-full"
            />

            {/* Aurora blob 1 — blue, top-right */}
            <div
                className="absolute -top-40 -right-40 w-[580px] h-[580px] rounded-full pointer-events-none animate-aurora-1"
                style={{
                    background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(96,165,250,0.04) 50%, transparent 70%)',
                    filter: 'blur(100px)',
                }}
            />

            {/* Aurora blob 2 — violet, bottom-left */}
            <div
                className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none animate-aurora-2"
                style={{
                    background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, rgba(37,99,235,0.03) 50%, transparent 70%)',
                    filter: 'blur(110px)',
                }}
            />
        </div>
    );
};

export default AnimatedBackground;
