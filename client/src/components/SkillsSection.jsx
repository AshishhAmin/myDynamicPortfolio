import React from 'react';
import { motion } from 'framer-motion';
import { FadeUp } from './MotionPrimitives';
import { API_URL } from '../config';

const SKILL_GROUPS = [
    { title: 'Engineering', skills: ['React', 'Node.js', 'PostgreSQL', 'Django', 'Next.js', 'Express', 'MongoDB', 'Python'] },
    { title: 'Design & Motion', skills: ['Tailwind CSS', 'Framer Motion', 'Vanilla CSS', 'UI Architecture', 'Layout Design'] },
    { title: 'Modern Stack & AI', skills: ['Prompt Engineering', 'Vite', 'Cloudinary', 'Neon DB', 'MQTT', 'Vector Search'] },
];

const SkillsSection = () => {
    const [skillGroups, setSkillGroups] = React.useState(SKILL_GROUPS);

    React.useEffect(() => {
        fetch(`${API_URL}/api/skills`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setSkillGroups(data.map(item => ({ title: item.category, skills: item.skills })));
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const allSkills = Array.from(new Set(skillGroups.reduce((acc, g) => [...acc, ...g.skills], [])));

    return (
        <section id="skills" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1200px] w-full mx-auto pt-24 pb-12 scroll-mt-32">
            <FadeUp className="mb-14 lg:mb-20">
                <span className="section-label">Toolset</span>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">
                    What I work with
                </h2>
                <p className="text-sm md:text-base text-text-muted font-body mt-4 max-w-lg leading-relaxed font-light">
                    Building scalable applications with a focus on clean code,
                    high-performance logic, and pixel-perfect transitions.
                </p>
            </FadeUp>

            <div className="flex flex-wrap gap-3 md:gap-3.5 max-w-4xl">
                {allSkills.map((skill, idx) => (
                    <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -2 }}
                        transition={{ delay: (idx % 15) * 0.04, duration: 0.35 }}
                        className="px-4 py-2 rounded-xl border border-border-DEFAULT bg-white text-text-muted hover:border-cta/50 hover:text-cta hover:bg-cta/5 transition-all cursor-default shadow-sm text-xs md:text-sm font-body font-semibold"
                    >
                        {skill}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
