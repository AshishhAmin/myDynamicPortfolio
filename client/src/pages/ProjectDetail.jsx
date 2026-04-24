import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code2, Cpu } from 'lucide-react';
import { API_URL } from '../config';
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
        fetch(`${API_URL}/api/project-item/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Project Not Found' : 'Server Error');
                return res.json();
            })
            .then(data => { setProject(data); setLoading(false); })
            .catch(err => { setFetchError(err.message); setLoading(false); });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-2 border-cta border-t-transparent rounded-full" />
        </div>
    );

    if (!project || fetchError) return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">{fetchError || 'Project Not Found'}</h1>
            <p className="text-text-muted font-body mb-8 max-w-md text-sm">
                {fetchError === 'Server Error' ? 'The backend is experiencing issues.' : 'The requested project could not be found.'}
            </p>
            <button onClick={() => navigate('/')} className="btn-ghost cursor-pointer">Return Home</button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-28 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">

                {/* Back */}
                <Link to="/" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors font-body font-semibold mb-10 cursor-pointer">
                    <ArrowLeft size={14} /> All Projects
                </Link>

                {/* Hero image */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative overflow-hidden rounded-3xl border border-border-DEFAULT aspect-[21/9] bg-bg-muted shadow-card-hover mb-12"
                >
                    {project.image_url && (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    )}
                    {/* Subtle bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* Main content */}
                    <div className="lg:col-span-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>

                            {/* Tech pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(project.tech_stack || []).map((tech, i) => (
                                    <span key={i} className="pill">{tech}</span>
                                ))}
                            </div>

                            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary tracking-tight mb-6 leading-tight">
                                {project.title}
                            </h1>

                            {/* End of headers */}

                            {/* Deep dive */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 section-label">
                                    <Code2 size={14} /> Summary
                                </h3>
                                <div className="text-text-muted font-body leading-relaxed text-base whitespace-pre-wrap">
                                    {project.long_description || 'Detailed technical breakdown coming soon. This project focuses on high-performance execution and scalable architecture.'}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-4">
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>

                            {/* Links card */}
                            <div className="card p-6">
                                <h3 className="section-label mb-5">Project Links</h3>
                                <div className="flex flex-col gap-3">
                                    {project.live_link && (
                                        <a
                                            href={project.live_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-primary cursor-pointer justify-between"
                                        >
                                            View Live Demo <ExternalLink size={15} />
                                        </a>
                                    )}
                                    {project.github_link && (
                                        <a
                                            href={project.github_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-ghost cursor-pointer justify-between"
                                        >
                                            Source Code <Github size={15} />
                                        </a>
                                    )}
                                    {!project.live_link && !project.github_link && (
                                        <p className="text-xs text-text-placeholder font-body italic">No links available yet.</p>
                                    )}
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
