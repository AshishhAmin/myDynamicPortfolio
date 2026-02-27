import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink, ArrowRight, Sparkles, ChevronRight, Download } from 'lucide-react';
import { API_URL } from '../config';
import { StaggerParent, StaggerChild, FadeUp } from '../components/MotionPrimitives';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';

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

const TimelineNode = ({ item, index }) => {
    const Icon = item.icon;
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            className="relative mb-12 flex items-center justify-between w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
        >
            {/* Central Line Divider */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-[120%] bg-zinc-800 top-0 hidden md:block" />

            {/* Node Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-zinc-950 z-10 hidden md:block" />

            {/* Content */}
            <div className={`w-full md:w-[45%] ${isLeft ? 'md:text-right' : 'md:text-left md:ml-auto'}`}>
                <div className="glass-card p-6 border border-white/[0.05] bg-white/[0.02] hover:border-white/20 transition-all duration-300">
                    <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <div className="p-2 rounded-xl bg-white/[0.05] text-white">
                            <Icon size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                            <p className="text-sm md:text-base lg:text-lg text-zinc-400 font-medium">{item.organization}</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 mb-4 text-[10px] md:text-xs lg:text-sm text-zinc-500 font-mono tracking-widest uppercase ${isLeft ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <Calendar size={12} className="lg:w-4 lg:h-4" />
                        <span>{item.period}</span>
                    </div>

                    <p className="text-xs md:text-sm lg:text-base text-zinc-500 leading-relaxed max-w-lg lg:mx-auto">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const Experience = () => {
    const [timeline, setTimeline] = React.useState(TIMELINE_DATA);

    React.useEffect(() => {
        fetch(`${API_URL}/api/experience`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const formatted = data.map(item => ({
                        ...item,
                        icon: item.type === 'education' ? GraduationCap : Briefcase
                    }));
                    setTimeline(formatted);
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <div id="experience" className="min-h-[100dvh] flex flex-col justify-center px-6 pt-24 pb-24 scroll-mt-32">
            <div className="max-w-5xl lg:max-w-6xl mx-auto w-full flex flex-col h-[100dvh] max-h-[850px]">
                <FadeUp className="mb-8 md:mb-12 text-center shrink-0">
                    <p className="text-[11px] md:text-sm text-zinc-600 tracking-[0.3em] uppercase mb-4">The Journey</p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter">
                        Experience <span className="text-zinc-600">&amp;</span> Education
                    </h2>
                </FadeUp>

                {/* Timeline Container */}
                <div className="relative flex-1 overflow-y-auto pr-2 md:pr-4 rounded-xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
                    {/* Vertical Line for Mobile */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800 md:hidden hidden md:block" />

                    <div className="space-y-0 relative pb-12">
                        {timeline.map((item, index) => (
                            <TimelineNode key={index} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experience;
