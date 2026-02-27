import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Terminal, Blocks, Cpu, Database, Eye, Info, ArrowUpRight } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { FadeUp } from './MotionPrimitives';

const PLACEHOLDER_PROJECTS = [
    {
        id: 1,
        title: 'Cashflow App',
        description: 'Personal finance tracker with real-time analytics, predictive insights, and beautiful charts.',
        tech_stack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        live_link: '#',
        year: '2024',
    },
    {
        id: 2,
        title: 'Digital Census Portal',
        description: 'High-scale national data collection with role-based access and survey management dashboards.',
        tech_stack: ['Next.js', 'PostgreSQL', 'Django'],
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        live_link: '#',
        year: '2024',
    },
    {
        id: 3,
        title: 'AGRITECH System',
        description: 'IoT-powered dashboard for real-time soil monitoring and automated smart irrigation.',
        tech_stack: ['Vue.js', 'Express', 'MQTT'],
        image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
        live_link: '#',
        year: '2023',
    },
    {
        id: 4,
        title: 'Dynamic Portfolio',
        description: 'This very site — a DB-driven portfolio CMS with Cloudinary uploads & Neon Postgres backend.',
        tech_stack: ['React', 'Framer Motion', 'Neon DB', 'Cloudinary'],
        image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80',
        live_link: '#',
        year: '2025',
    },
];

const ProjectsShowcase = ({ projects: propProjects = [] }) => {
    const navigate = useNavigate();
    const [dbProjects, setDbProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/projects`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDbProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching projects:', err);
                setLoading(false);
            });
    }, []);

    const displayProjects = dbProjects.length > 0 ? dbProjects : (propProjects.length > 0 ? propProjects : PLACEHOLDER_PROJECTS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + displayProjects.length) % displayProjects.length);
    };

    const project = displayProjects[currentIndex];

    if (!project) return null;

    return (
        <section id="projects" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] w-full mx-auto pt-24 pb-12 relative overflow-hidden scroll-mt-32">
            {/* Section header */}
            <FadeUp className="mb-8 md:mb-12 text-center md:text-left">
                <p className="text-[11px] md:text-sm text-zinc-600 tracking-[0.3em] uppercase mb-2 md:mb-4">Selected Works</p>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    Things I've built
                </h2>
            </FadeUp>

            {/* Carousel Container */}
            <div className="relative h-[600px] md:h-[600px] lg:h-[62vh] w-full flex items-center justify-center mt-4">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute w-full flex flex-col md:flex-row items-center gap-6 md:gap-12"
                    >
                        {/* Project Image */}
                        <div
                            className="w-full md:w-3/5 aspect-video md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.03] shadow-2xl relative group cursor-pointer"
                            onClick={() => project.id && navigate(`/project/${project.id}`)}
                        >
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="px-6 py-2 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs md:text-sm lg:text-base font-bold uppercase tracking-wider">
                                    Explore Case Study
                                </span>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="w-full md:w-2/5 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
                                <span className="text-[10px] md:text-sm font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">
                                    {String(currentIndex + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] md:text-sm font-mono text-zinc-600 tracking-widest">{project.year || '2025'}</span>
                            </div>

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
                                {project.title}
                            </h3>

                            <p className="text-sm md:text-base lg:text-base text-zinc-500 leading-relaxed mb-6 md:mb-8 max-w-md lg:max-w-lg mx-auto md:mx-0 font-light">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 md:mb-10">
                                {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map(tech => (
                                    <span key={tech} className="text-[10px] md:text-xs lg:text-xs text-zinc-400 font-medium bg-white/[0.05] border border-white/[0.1] px-3 py-1 md:px-4 md:py-1 rounded-full">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 lg:gap-6">
                                <button
                                    onClick={() => project.id && navigate(`/project/${project.id}`)}
                                    className="px-6 py-3 lg:px-7 lg:py-3.5 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-xs md:text-sm lg:text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <Info size={16} className="md:w-5 md:h-5 lg:w-5 lg:h-5" /> Details
                                </button>
                                {project.live_link && project.live_link !== '#' && (
                                    <a
                                        href={project.live_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                                    >
                                        <ArrowUpRight size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    className="absolute left-0 z-20 p-4 rounded-full bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all hidden md:block -ml-6"
                    onClick={() => paginate(-1)}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    className="absolute right-0 z-20 p-4 rounded-full bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all hidden md:block -mr-6"
                    onClick={() => paginate(1)}
                >
                    <ChevronRight size={24} />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex gap-3">
                    {displayProjects.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1);
                                setCurrentIndex(i);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-6' : 'bg-zinc-800'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsShowcase;
