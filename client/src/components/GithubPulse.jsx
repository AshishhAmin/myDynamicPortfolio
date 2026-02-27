import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Circle, GitBranch, ArrowUpRight } from 'lucide-react';
import { FadeUp } from './MotionPrimitives';

const GithubPulse = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/github')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out nulls and slice to top 4
                    setRepos(data.slice(0, 4));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching github pulse:', err);
                setLoading(false);
            });
    }, []);

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    // Color mapper for common languages
    const getLanguageColor = (lang) => {
        const colors = {
            'JavaScript': 'text-yellow-400',
            'TypeScript': 'text-blue-400',
            'HTML': 'text-orange-500',
            'CSS': 'text-blue-500',
            'Python': 'text-green-500',
            'Java': 'text-red-500',
            'C++': 'text-pink-500',
            'Vue': 'text-emerald-400',
            'C#': 'text-purple-500',
        };
        return colors[lang] || 'text-zinc-400';
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!repos || repos.length === 0) return null;

    return (
        <section id="pulse" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] w-full mx-auto pt-24 pb-12 relative scroll-mt-32 border-t border-white/[0.05]">
            <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/[0.03] border border-white/10">
                        <Github size={20} className="text-white relative z-10 lg:w-6 lg:h-6" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-cyber-neon/20 blur-sm"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 lg:gap-3">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">GitHub Pulse</h3>
                            <span className="relative flex h-2 w-2 lg:h-2 lg:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neon opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 lg:h-2 lg:w-2 bg-cyber-neon"></span>
                            </span>
                        </div>
                        <p className="text-xs md:text-sm text-zinc-500 font-mono tracking-widest uppercase mt-1">Live Activity Stream</p>
                    </div>
                </div>

                <a
                    href="https://github.com/AshishhAmin"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs md:text-sm font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-2 border border-white/10 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full hover:bg-white/[0.05]"
                >
                    View Profile <ArrowUpRight size={14} className="lg:w-4 lg:h-4" />
                </a>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {repos.map((repo, idx) => (
                    <FadeUp key={repo.id} delay={0.1 * idx} className="h-full">
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col h-full p-5 lg:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-cyber-neon/30 hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3 lg:mb-4">
                                <div className="flex items-center gap-2 text-white font-semibold flex-1 min-w-0 text-sm md:text-base lg:text-lg">
                                    <GitBranch size={16} className="text-zinc-500 shrink-0 lg:w-5 lg:h-5" />
                                    <span className="truncate group-hover:text-cyber-neon transition-colors">{repo.name}</span>
                                </div>
                            </div>

                            <p className="text-xs md:text-sm text-zinc-400 line-clamp-2 lg:line-clamp-3 leading-relaxed mb-6 lg:mb-8 flex-1">
                                {repo.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center justify-between text-[10px] md:text-xs font-mono font-medium text-zinc-500 mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    {repo.language && (
                                        <span className="flex items-center gap-1.5">
                                            <Circle size={8} className={`fill-current ${getLanguageColor(repo.language)}`} />
                                            {repo.language}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 lg:gap-1.5">
                                        <Star size={12} className="lg:w-3.5 lg:h-3.5" /> {repo.stargazers_count}
                                    </span>
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
