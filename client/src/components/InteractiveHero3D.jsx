import React, { useRef, useEffect } from 'react';

/**
 * LightweightParticles
 * ─────────────────────
 * Pure Canvas 2D replacement for the Three.js particle field.
 * ~120 dots with subtle mouse-parallax on desktop.
 * Zero WebGL, zero GPU overhead — respects prefers-reduced-motion.
 */
const LightweightParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Respect reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        // Mobile detection — skip particles on small screens to save battery
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        let raf;
        let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Generate particles
        const count = 120;
        const particles = Array.from({ length: count }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.5 + 0.5,
            a: Math.random() * 0.5 + 0.1,
            da: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
            // Depth factor for parallax (0 = far/slow, 1 = near/fast)
            depth: Math.random(),
            dx: (Math.random() - 0.5) * 0.00015,
            dy: (Math.random() - 0.5) * 0.0001,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const W = canvas.width;
            const H = canvas.height;

            const cx = mouse.x / W - 0.5; // -0.5 → 0.5
            const cy = mouse.y / H - 0.5;

            particles.forEach(p => {
                // Gentle pulse
                p.a += p.da;
                if (p.a > 0.65 || p.a < 0.08) p.da *= -1;

                // Slow drift
                p.x += p.dx;
                p.y += p.dy;
                if (p.x > 1.05) p.x = -0.05;
                if (p.x < -0.05) p.x = 1.05;
                if (p.y > 1.05) p.y = -0.05;
                if (p.y < -0.05) p.y = 1.05;

                // Parallax offset (deeper particles move less)
                const parallaxStrength = 25 * p.depth;
                const px = p.x * W + cx * parallaxStrength;
                const py = p.y * H + cy * parallaxStrength;

                ctx.save();
                ctx.globalAlpha = p.a;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(px, py, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
};

export default function InteractiveHero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 hidden md:block">
            <LightweightParticles />
        </div>
    );
}
