import React from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { StaggerParent, StaggerChild } from './MotionPrimitives';
import InteractiveHero3D from './InteractiveHero3D';

const HeroSection = () => {
    const [desc, setDesc] = React.useState('');

    React.useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.description) setDesc(data.description);
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const defaultDesc = (
        <>
            Specialized in crafting <span className="text-white font-normal underline decoration-zinc-800 underline-offset-4">high-performance web experiences</span> and intelligent systems.
            I bridge the gap between complex backend logic and seamless frontend interactions, leverage
            AI-driven workflows as a <span className="text-white font-normal">Prompt Engineer</span> to accelerate
            development, and focus on clean, scalable architecture that stands the test of time.
        </>
    );

    return (
        <section
            id="about"
            className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden scroll-mt-32"
        >
            {/* 3D Background */}
            {/* <InteractiveHero3D /> */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Bottom-left descriptor — like the reference */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="fixed bottom-16 left-6 text-left z-40 hidden md:block"
                >
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[180px]">
                        A Product Designer with a passion<br />for design transitions.
                    </p>
                </motion.div>

                {/* Top-right descriptor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="fixed top-14 right-6 text-right z-40 hidden md:block"
                >
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">
                        Prompt Engineer &amp; Full-Stack Developer<br />based in India.
                    </p>
                </motion.div>

                {/* Centre: Name */}
                <StaggerParent delay={0.6} className="z-10 relative pointer-events-none">
                    <h1 className="text-[15vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tight text-white leading-[0.9] whitespace-nowrap">
                        <StaggerChild className="block">ashish</StaggerChild>
                        <StaggerChild className="block text-zinc-600 font-light italic text-[8vw] md:text-[4.5vw] mt-2">
                            k. amin
                        </StaggerChild>
                    </h1>
                </StaggerParent>

                {/* Small tagline below */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mt-8 text-xs text-zinc-500 tracking-[0.25em] uppercase font-medium"
                >
                    Building things that live on the internet
                </motion.p>

                {/* Detailed Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 md:mt-10 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto z-10 relative pointer-events-none px-4"
                >
                    <p className="text-sm md:text-lg lg:text-xl text-zinc-400 leading-relaxed font-light">
                        {desc || defaultDesc}
                    </p>
                </motion.div>

                {/* Scroll nudge */}
                <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 flex flex-col items-center gap-1"
                >
                    <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
                    <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
