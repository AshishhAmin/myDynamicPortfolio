import React, { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

/**
 * OrbitalBackground
 * ─────────────────
 * Canvas-based: 3 large intersecting orbit rings with tiny bright
 * particles orbiting along them at varying speeds.
 * A warm, very-dark inner glow + blue edge border completes the look.
 */
const OrbitalBackground = () => {
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ── 3 intersecting orbits ─────────────────────────────────────────
        const orbits = [
            { cx: 0.50, cy: 0.45, rx: 0.28, ry: 0.40, tilt: 0, particleCount: 6, speed: 0.0004 },
            { cx: 0.44, cy: 0.52, rx: 0.30, ry: 0.38, tilt: 0.5, particleCount: 5, speed: -0.0003 },
            { cx: 0.56, cy: 0.50, rx: 0.26, ry: 0.42, tilt: -0.4, particleCount: 4, speed: 0.00025 },
        ];

        // Give each orbit its own array of particle angle offsets
        const particleAngles = orbits.map(o =>
            Array.from({ length: o.particleCount }, (_, i) =>
                (i / o.particleCount) * Math.PI * 2
            )
        );

        let t = 0;

        // Utility: point on a tilted ellipse
        const ellipsePoint = (cx, cy, rx, ry, tilt, angle) => {
            const W = canvas.width, H = canvas.height;
            const x0 = Math.cos(angle) * rx * W;
            const y0 = Math.sin(angle) * ry * H;
            return {
                x: cx * W + x0 * Math.cos(tilt) - y0 * Math.sin(tilt),
                y: cy * H + x0 * Math.sin(tilt) + y0 * Math.cos(tilt),
            };
        };

        // ── Cosmic dust (larger, softer particles) ────────────────────────
        const dust = Array.from({ length: 40 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 2 + 1,
            a: Math.random() * 0.3 + 0.1,
            dx: (Math.random() * 0.0004 + 0.0001),
            dy: (Math.random() * 0.0002 - 0.0001),
        }));

        // ── Sparse star field ─────────────────────────────────────────────
        const stars = Array.from({ length: 150 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 0.8 + 0.2,
            a: Math.random(),
            da: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
            dx: (Math.random() - 0.5) * 0.0002, // Slow horizontal drift
            dy: (Math.random() - 0.5) * 0.0001, // Slow vertical drift
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const W = canvas.width, H = canvas.height;

            // ── Dust ────────────────────────────────────────────────────────
            dust.forEach(d => {
                d.x += d.dx;
                d.y += d.dy;
                if (d.x > 1.1) d.x = -0.1;
                if (d.y > 1.1) d.y = -0.1;
                if (d.y < -0.1) d.y = 1.1;

                ctx.save();
                ctx.globalAlpha = d.a;
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // ── Stars ───────────────────────────────────────────────────────
            stars.forEach(s => {
                s.a += s.da;
                if (s.a > 1 || s.a < 0.15) s.da *= -1;

                // Drift stars slowly
                s.x += s.dx;
                s.y += s.dy;

                // Wrap around edges
                if (s.x > 1.05) s.x = -0.05;
                if (s.x < -0.05) s.x = 1.05;
                if (s.y > 1.05) s.y = -0.05;
                if (s.y < -0.05) s.y = 1.05;

                ctx.save();
                ctx.globalAlpha = s.a * 0.6;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // ── Orbit rings ─────────────────────────────────────────────────
            orbits.forEach((o, oi) => {
                // Draw ellipse by sampling points
                ctx.save();
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.01) {
                    const p = ellipsePoint(o.cx, o.cy, o.rx, o.ry, o.tilt, a);
                    a === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = 'rgba(255,255,255,0.07)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();

                // ── Orbiting particles ───────────────────────────────────────
                particleAngles[oi] = particleAngles[oi].map(a => a + o.speed);
                particleAngles[oi].forEach(angle => {
                    const p = ellipsePoint(o.cx, o.cy, o.rx, o.ry, o.tilt, angle);

                    // Glow halo
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
                    grd.addColorStop(0, 'rgba(255,255,255,0.9)');
                    grd.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.save();
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    // Core dot
                    ctx.save();
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = 0.95;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            });

            t++;
            raf = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden"
            style={{ background: '#000000' }}
        >
            {/* Canvas */}
            <motion.canvas
                ref={canvasRef}
                style={{ y: canvasY, willChange: 'transform' }}
                className="absolute inset-0 w-full h-full"
            />

            {/* Inner warm glow (centre) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 46%, rgba(30,20,10,0.55) 0%, transparent 70%)',
                }}
            />

            {/* Edge blue glow border — signature of the reference site */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    boxShadow: 'inset 0 0 80px 20px rgba(20,40,120,0.35)',
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
                }}
            />
        </div>
    );
};

export default OrbitalBackground;
