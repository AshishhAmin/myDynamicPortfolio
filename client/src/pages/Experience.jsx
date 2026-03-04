import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { API_URL } from '../config';
import { FadeUp } from '../components/MotionPrimitives';

const TIMELINE_DATA = [
    {
        type: 'experience',
        title: 'Senior Full-Stack Developer',
        organization: 'TechFlow Systems',
        period: '2023 - Present',
        description: 'Lead developer for core banking infrastructure. Managed a team of 5 engineers to migrate legacy services to modern React/Node architecture.',
        icon: Briefcase,
    },
    {
        type: 'experience',
        title: 'Full-Stack Developer',
        organization: 'Digital Artisans',
        period: '2021 - 2023',
        description: 'Developed and maintained 15+ high-traffic client websites. Implemented CI/CD pipelines reducing deployment time by 40%.',
        icon: Briefcase,
    },
    {
        type: 'education',
        title: 'Bachelor of Technology in CS',
        organization: 'Global Institute of Technology',
        period: '2017 - 2021',
        description: 'Specialization in Software Engineering. Graduated with honors. Lead researcher for the University AI Lab.',
        icon: GraduationCap,
    },
    {
        type: 'education',
        title: 'Higher Secondary Education',
        organization: 'Oakridge International',
        period: '2015 - 2017',
        description: 'Major in Physics, Chemistry, and Mathematics.',
        icon: GraduationCap,
    },
];

const TYPE_CONFIG = {
    experience: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        ring: 'ring-blue-200',
        stripe: 'bg-blue-500',
    },
    education: {
        bg: 'bg-violet-50',
        text: 'text-violet-600',
        border: 'border-violet-200',
        dot: 'bg-violet-500',
        ring: 'ring-violet-200',
        stripe: 'bg-violet-500',
    },
};

const TimelineNode = ({ item, index }) => {
    const Icon = item.icon;
    const isLeft = index % 2 === 0;
    const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.experience;

    return (
        <motion.div
            className="relative mb-10 md:mb-14 flex items-start md:items-center justify-between w-full"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Centre vertical line (desktop) — hardcoded hex so Tailwind resolves it */}
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-[110%] top-0 hidden md:block" style={{ background: '#E4E4E7' }} />

            {/* Centre dot (desktop) */}
            <div className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full ${cfg.dot} ring-4 ${cfg.ring} z-10 hidden md:block shadow-sm`} />

            {/* Mobile left line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 md:hidden" style={{ background: '#E4E4E7' }} />
            <div className={`absolute left-[14px] top-7 w-3 h-3 rounded-full ${cfg.dot} ring-4 ${cfg.ring} z-10 md:hidden`} />

            {/* Card */}
            <div className={`w-full pl-12 md:pl-0 md:w-[46%] ${isLeft ? '' : 'md:ml-auto'}`}>
                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                    {/* Coloured top stripe */}
                    <div className={`h-1 w-full ${cfg.stripe}`} />

                    <div className="p-5 md:p-6">
                        {/* Icon + title */}
                        <div className={`flex items-start gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse md:text-right' : ''}`}>
                            <div className={`p-2.5 rounded-xl ${cfg.bg} ${cfg.border} border shrink-0`}>
                                <Icon size={15} className={cfg.text} />
                            </div>
                            <div>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.text} mb-0.5 block`}>
                                    {item.type}
                                </span>
                                <h3 className="text-base md:text-[1.05rem] font-bold text-[#18181B] leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#52525B] font-medium mt-0.5">
                                    {item.organization}
                                </p>
                            </div>
                        </div>

                        {/* Period */}
                        <div className={`flex items-center gap-1.5 mb-3 text-[11px] text-[#A1A1AA] font-mono tracking-widest uppercase ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                            <Calendar size={11} />
                            <span>{item.period}</span>
                        </div>

                        {/* Description */}
                        <p className={`text-sm text-[#52525B] leading-relaxed font-light ${isLeft ? 'md:text-right' : ''}`}>
                            {item.description}
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* Experience — designed to be embedded in LandingPage (no AnimatedBackground / Footer) */
const Experience = () => {
    const [timeline, setTimeline] = React.useState(TIMELINE_DATA);

    React.useEffect(() => {
        fetch(`${API_URL}/api/experience`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setTimeline(data.map(item => ({
                        ...item,
                        icon: item.type === 'education' ? GraduationCap : Briefcase,
                    })));
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <div id="experience" className="flex flex-col px-4 md:px-8 lg:px-16 pt-24 pb-16 scroll-mt-20">
            <div className="max-w-5xl lg:max-w-6xl mx-auto w-full">

                {/* Section header */}
                <FadeUp className="mb-12 md:mb-16 text-center">
                    <span className="section-label">The Journey</span>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#18181B] mt-3 tracking-tight">
                        Experience &amp; Education
                    </h2>
                    <p className="text-[#52525B] mt-4 max-w-lg mx-auto text-sm md:text-base leading-relaxed font-light">
                        A timeline of where I've worked, studied, and grown as an engineer.
                    </p>
                </FadeUp>

                {/* Timeline */}
                <div className="relative">
                    {/* Top connector */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-px h-8" style={{ background: '#E4E4E7' }} />

                    <div className="space-y-0 relative pb-10">
                        {timeline.map((item, index) => (
                            <TimelineNode key={index} item={item} index={index} />
                        ))}
                    </div>

                    {/* Bottom cap */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-2 w-3.5 h-3.5 rounded-full items-center justify-center" style={{ background: '#E4E4E7' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experience;
