import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Terminal, Code2, Cpu } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setFetchError(null);
        fetch(`http://localhost:5000/api/project-item/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Project Not Found' : 'Server Error');
                return res.json();
            })
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching project:', err);
                setFetchError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-cyber-neon border-t-transparent rounded-full"
            />
        </div>
    );

    if (!project || fetchError) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black uppercase mb-4 text-white">
                {fetchError || 'Project Not Found'}
            </h1>
            <p className="text-zinc-500 mb-8 max-w-md">
                {fetchError === 'Server Error'
                    ? "The backend is currently experiencing issues. Please ensure the server is running."
                    : "The requested project could not be found in our database."}
            </p>
            <button onClick={() => navigate('/')} className="pill px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-bold uppercase tracking-wider text-sm">
                Return Home
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-[#d0d0d0] selection:bg-cyber-neon/30">
            <AnimatedBackground />

            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto group flex items-center gap-2 pill pl-4 pr-6 py-2 bg-[#0a0a0a]/80 backdrop-blur-md border-white/10 hover:border-cyber-neon/50 transition-all"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back</span>
                </motion.button>
            </nav>

            <main className="relative pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column: Image & Basic Info */}
                    <div className="lg:col-span-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 aspect-[21/9] bg-[#0a0a0a]"
                        >
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                        </motion.div>
                    </div>

                    {/* Middle: Core Content */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex flex-wrap gap-3 mb-8">
                                {project.tech_stack && project.tech_stack.map((tech, i) => (
                                    <span key={i} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/[0.08] rounded-full text-zinc-400">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 bg-gradient-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
                                {project.title}
                            </h1>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-12 italic border-l-4 border-cyber-neon pl-8 py-2">
                                    {project.description}
                                </p>

                                <div className="space-y-8">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyber-neon flex items-center gap-3">
                                        <Terminal size={18} /> The Deep Dive
                                    </h3>
                                    <div className="text-zinc-300 leading-relaxed font-light text-lg whitespace-pre-wrap">
                                        {project.long_description || "Detailed technical breakdown coming soon. This project focuses on high-performance execution and scalable architecture."}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Sidebar Actions */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8 border-white/[0.08] flex flex-col gap-8"
                        >
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Project Links</h3>
                                <div className="flex flex-col gap-4">
                                    {project.live_link && (
                                        <a
                                            href={project.live_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-white text-[#050505] font-bold uppercase tracking-wider text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            View Live Demo
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {project.github_link && (
                                        <a
                                            href={project.github_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/[0.03] text-white font-bold uppercase tracking-wider text-sm transition-all"
                                        >
                                            Storage / Code
                                            <Github size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Architecture</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-white">
                                            <Code2 size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Frontend</div>
                                            <div className="text-sm font-bold">Robust Component Library</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-white">
                                            <Cpu size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Performance</div>
                                            <div className="text-sm font-bold">Optimized Render Logic</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
