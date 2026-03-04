import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Circle, GitBranch, ArrowUpRight } from 'lucide-react';
import { API_URL } from '../config';
import { FadeUp } from './MotionPrimitives';

const GithubPulse = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/github`)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setRepos(data.slice(0, 4)); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const getTimeAgo = (dateString) => {
        const s = Math.floor((new Date() - new Date(dateString)) / 1000);
        if (s / 31536000 > 1) return Math.floor(s / 31536000) + ' yrs ago';
        if (s / 2592000 > 1) return Math.floor(s / 2592000) + ' mo ago';
        if (s / 86400 > 1) return Math.floor(s / 86400) + ' days ago';
        if (s / 3600 > 1) return Math.floor(s / 3600) + ' hrs ago';
        if (s / 60 > 1) return Math.floor(s / 60) + ' min ago';
        return Math.floor(s) + 's ago';
    };

    const langColor = (l) => ({ JavaScript: 'text-yellow-500', TypeScript: 'text-blue-500', HTML: 'text-orange-500', CSS: 'text-blue-400', Python: 'text-green-500', Java: 'text-red-500', 'C++': 'text-pink-500', Vue: 'text-emerald-500', 'C#': 'text-purple-500' }[l] || 'text-text-placeholder');

    if (loading) return (
        <div className="w-full flex justify-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-6 h-6 border-2 border-cta border-t-transparent rounded-full" />
        </div>
    );

    if (!repos || repos.length === 0) return null;

    return (
        <section id="pulse" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] w-full mx-auto pt-24 pb-12 relative scroll-mt-32 border-t border-border-DEFAULT">
            <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-border-DEFAULT shadow-card">
                        <Github size={20} className="text-primary" />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl bg-cta/10 blur-sm"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary">GitHub Pulse</h3>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                        </div>
                        <p className="section-label mt-0.5">Live Activity Stream</p>
                    </div>
                </div>

                <a href="https://github.com/AshishhAmin" target="_blank" rel="noreferrer" className="btn-ghost text-xs cursor-pointer">
                    View Profile <ArrowUpRight size={14} />
                </a>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {repos.map((repo, idx) => (
                    <FadeUp key={repo.id} delay={0.08 * idx} className="h-full">
                        <a href={repo.html_url} target="_blank" rel="noreferrer" className="card flex flex-col h-full p-5 cursor-pointer group">
                            <div className="flex items-center gap-2 mb-3">
                                <GitBranch size={15} className="text-text-placeholder shrink-0" />
                                <span className="text-sm font-body font-semibold text-primary truncate group-hover:text-cta transition-colors">{repo.name}</span>
                            </div>
                            <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-5 flex-1 font-body">
                                {repo.description || 'No description provided.'}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono text-text-placeholder mt-auto pt-3.5 border-t border-border-DEFAULT">
                                <div className="flex items-center gap-3">
                                    {repo.language && (
                                        <span className="flex items-center gap-1.5">
                                            <Circle size={7} className={`fill-current ${langColor(repo.language)}`} />
                                            {repo.language}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1"><Star size={11} /> {repo.stargazers_count}</span>
                                </div>
                                <span>{getTimeAgo(repo.updated_at)}</span>
                            </div>
                        </a>
                    </FadeUp>
                ))}
            </div>
        </section>
    );
};

export default GithubPulse;
