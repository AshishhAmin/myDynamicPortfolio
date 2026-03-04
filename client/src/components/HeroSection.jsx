import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { API_URL } from '../config';
import { StaggerParent, StaggerChild } from './MotionPrimitives';
import InteractiveHero3D from './InteractiveHero3D';

const HeroSection = () => {
    const [desc, setDesc] = React.useState('');

    React.useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => { if (data.description) setDesc(data.description); })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const defaultDesc = (
        <>
            Specialized in crafting{' '}
            <span className="text-primary font-semibold border-b-2 border-cta/40">
                high-performance web experiences
            </span>{' '}
            and intelligent systems. I bridge complex backend logic with seamless frontend interactions,
            leveraging AI-driven workflows as a{' '}
            <span className="text-primary font-semibold">Prompt Engineer</span>.
        </>
    );

    /* Stagger delays */
    const fadeUp = (delay) => ({
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <section
            id="about"
            className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden scroll-mt-32"
        >
            {/* Particle canvas — desktop only */}
            <InteractiveHero3D />

            {/* Soft blue-centre spotlight */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(37,99,235,0.07) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-0">

                {/* ── Available badge ────────────────────────────── */}
                <motion.div {...fadeUp(0.6)} className="mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-body font-semibold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available for projects
                    </span>
                </motion.div>

                {/* ── Name ──────────────────────────────────────── */}
                <StaggerParent delay={0.75} className="z-10 relative pointer-events-none w-full">
                    <h1 className="font-heading leading-[0.88] tracking-tight text-primary">
                        <StaggerChild>
                            <span className="block text-[18vw] md:text-[11vw] lg:text-[8.5vw]">Ashish</span>
                        </StaggerChild>
                        <StaggerChild>
                            <span className="block text-[11vw] md:text-[5.8vw] lg:text-[4.4vw] text-text-muted font-normal italic">
                                K. Amin
                            </span>
                        </StaggerChild>
                    </h1>
                </StaggerParent>

                {/* ── Role pills ────────────────────────────────── */}
                <motion.div {...fadeUp(1.25)} className="mt-6 flex flex-wrap justify-center gap-2">
                    {['Full-Stack Developer', 'Prompt Engineer', 'UI/UX Architect'].map((role) => (
                        <span
                            key={role}
                            className="px-3.5 py-1 rounded-full bg-white border border-border-DEFAULT text-xs font-body font-semibold text-text-muted shadow-sm"
                        >
                            {role}
                        </span>
                    ))}
                </motion.div>

                {/* ── Tagline / section-label ────────────────────── */}
                <motion.div {...fadeUp(1.4)} className="mt-5">
                    <span className="section-label">Building things that live on the internet</span>
                </motion.div>

                {/* ── Description ──────────────────────────────── */}
                <motion.p
                    {...fadeUp(1.6)}
                    className="mt-5 max-w-lg md:max-w-2xl text-sm md:text-base lg:text-[1.05rem] text-text-muted font-body leading-relaxed font-light"
                >
                    {desc || defaultDesc}
                </motion.p>

                {/* ── CTA buttons ──────────────────────────────── */}
                <motion.div
                    {...fadeUp(1.85)}
                    className="mt-9 flex flex-wrap justify-center gap-3"
                >
                    <a href="/#projects" className="btn-primary cursor-pointer">
                        View my work <ArrowDown size={15} className="animate-float" />
                    </a>
                    <a href="/#contact" className="btn-ghost cursor-pointer">
                        <Mail size={15} />
                        Get in touch
                    </a>
                </motion.div>

            </div>

            {/* ── Scroll nudge ─────────────────────────────────── */}
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
            >
                <span className="text-[10px] tracking-[0.2em] uppercase text-text-placeholder font-body">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-border-DEFAULT to-transparent" />
            </motion.div>

            {/* ── Corner labels (desktop only) ─────────────────── */}
            <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="fixed bottom-16 left-6 text-left z-40 hidden lg:block text-[10px] text-text-placeholder font-body leading-relaxed max-w-[160px]"
            >
                A Product Designer with a passion for design transitions.
            </motion.p>
            <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="fixed top-20 right-6 text-right z-40 hidden lg:block text-[10px] text-text-placeholder font-body leading-relaxed max-w-[180px]"
            >
                Prompt Engineer &amp; Full-Stack Developer<br />based in India.
            </motion.p>
        </section>
    );
};

export default HeroSection;
