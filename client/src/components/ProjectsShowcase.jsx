import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { FadeUp } from './MotionPrimitives';

const PLACEHOLDER_PROJECTS = [
    { id: 1, title: 'Cashflow App', tech_stack: ['React', 'Node.js', 'MongoDB', 'Tailwind'], image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', live_link: '#', year: '2024' },
    { id: 2, title: 'Digital Census Portal', tech_stack: ['Next.js', 'PostgreSQL', 'Django'], image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', live_link: '#', year: '2024' },
    { id: 3, title: 'AGRITECH System', tech_stack: ['Vue.js', 'Express', 'MQTT'], image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80', live_link: '#', year: '2023' },
    { id: 4, title: 'Dynamic Portfolio', tech_stack: ['React', 'Framer Motion', 'Neon DB', 'Cloudinary'], image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80', live_link: '#', year: '2025' },
];

const ProjectsShowcase = ({ projects: propProjects = [] }) => {
    const navigate = useNavigate();
    const [dbProjects, setDbProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/api/projects`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setDbProjects(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const all = dbProjects.length > 0 ? dbProjects : (propProjects.length > 0 ? propProjects : PLACEHOLDER_PROJECTS);

    const paginate = (d) => {
        setDirection(d);
        setCurrentIndex(prev => (prev + d + all.length) % all.length);
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 900 : -900, opacity: 0, scale: 0.96 }),
        center: { x: 0, opacity: 1, scale: 1, zIndex: 1 },
        exit: (d) => ({ x: d < 0 ? 900 : -900, opacity: 0, scale: 0.96, zIndex: 0 }),
    };

    const project = all[currentIndex];
    if (!project) return null;

    return (
        <section id="projects" className="min-h-[90dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1200px] w-full mx-auto pt-24 pb-12 relative overflow-hidden scroll-mt-32">
            <FadeUp className="mb-8 md:mb-12 text-center md:text-left">
                <span className="section-label">Selected Works</span>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mt-2 tracking-tight">
                    Things I've built
                </h2>
            </FadeUp>

            <div className="relative h-[570px] md:h-[550px] lg:h-[55vh] w-full flex items-center justify-center mt-4">

                {/* Mobile dots */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                    {all.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-cta w-5' : 'bg-border-strong w-1.5'}`} />
                    ))}
                </div>

                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: 'spring', stiffness: 280, damping: 30 }, opacity: { duration: 0.2 }, scale: { duration: 0.4 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -10000) paginate(1);
                            else if (swipe > 10000) paginate(-1);
                        }}
                        className="absolute w-full flex flex-col md:flex-row items-center gap-6 md:gap-12"
                    >
                        {/* Image */}
                        <div
                            className="w-full md:w-1/2 aspect-video md:aspect-[16/10] rounded-3xl overflow-hidden border border-border-DEFAULT bg-bg-muted shadow-card-hover relative group cursor-pointer"
                            onClick={() => project.id && navigate(`/project/${project.id}`)}
                        >
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="btn-primary text-xs">Explore Case Study</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                                <span className="text-[10px] font-mono text-text-placeholder border border-border-DEFAULT px-2.5 py-0.5 rounded-full bg-white">
                                    {String(currentIndex + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] font-mono text-text-placeholder tracking-widest">{project.year || '2025'}</span>
                            </div>

                            <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 leading-tight">
                                {project.title}
                            </h3>

                            <div className="mb-5"></div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                                {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map(tech => (
                                    <span key={tech} className="pill">{tech}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <button
                                    onClick={() => project.id && navigate(`/project/${project.id}`)}
                                    className="btn-primary text-xs cursor-pointer"
                                >
                                    <Info size={15} /> Details
                                </button>
                                {project.live_link && project.live_link !== '#' && (
                                    <a href={project.live_link} target="_blank" rel="noreferrer" className="btn-ghost text-xs cursor-pointer p-2.5">
                                        <ArrowUpRight size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Desktop nav */}
                <button onClick={() => paginate(-1)} className="absolute left-0 z-20 p-3.5 rounded-2xl bg-white border border-border-DEFAULT text-text-muted hover:text-primary hover:shadow-card transition-all hidden md:block -ml-5 cursor-pointer">
                    <ChevronLeft size={22} />
                </button>
                <button onClick={() => paginate(1)} className="absolute right-0 z-20 p-3.5 rounded-2xl bg-white border border-border-DEFAULT text-text-muted hover:text-primary hover:shadow-card transition-all hidden md:block -mr-5 cursor-pointer">
                    <ChevronRight size={22} />
                </button>

                {/* Desktop dots */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden md:flex gap-2.5">
                    {all.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? 'bg-cta w-7' : 'bg-border-strong w-2 hover:bg-primary/40'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsShowcase;
