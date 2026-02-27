import React from 'react';
import { motion } from 'framer-motion';
import { FadeUp } from './MotionPrimitives';
import { API_URL } from '../config';

const SKILL_GROUPS = [
    {
        title: 'Engineering',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Django', 'Next.js', 'Express', 'MongoDB', 'Python']
    },
    {
        title: 'Design & Motion',
        skills: ['Tailwind CSS', 'Framer Motion', 'Vanilla CSS', 'UI Architecture', 'Layout Design']
    },
    {
        title: 'Modern Stack & AI',
        skills: ['Prompt Engineering', 'Vite', 'Cloudinary', 'Neon DB', 'MQTT', 'Vector Search']
    }
];

const SkillsSection = () => {
    const [skillGroups, setSkillGroups] = React.useState(SKILL_GROUPS);

    React.useEffect(() => {
        fetch(`${API_URL}/api/skills`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    // Map DB format (category, skills[]) to UI format (title, skills[])
                    const formatted = data.map(item => ({
                        title: item.category,
                        skills: item.skills
                    }));
                    setSkillGroups(formatted);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <section id="skills" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] w-full mx-auto pt-24 pb-12 scroll-mt-32">
            <FadeUp className="mb-16 lg:mb-24">
                <p className="text-[11px] md:text-sm text-zinc-600 tracking-[0.3em] uppercase mb-2 lg:mb-4">Toolset</p>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    What I work with
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-zinc-500 mt-4 lg:mt-6 max-w-lg lg:max-w-2xl leading-relaxed">
                    Building scalable applications with a focus on clean code,
                    high-performance logic, and pixel-perfect transitions.
                </p>
            </FadeUp>

            <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5 max-w-4xl lg:max-w-5xl">
                {Array.from(new Set(skillGroups.reduce((acc, group) => [...acc, ...group.skills], []))).map((skill, idx) => (
                    <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (idx % 15) * 0.05, duration: 0.4 }}
                        className="px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl border border-white/[0.05] bg-white/[0.02] text-zinc-400 hover:border-cyber-neon/50 hover:text-white hover:bg-white/[0.05] transition-all cursor-default shadow-sm text-sm md:text-base"
                    >
                        {skill}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
