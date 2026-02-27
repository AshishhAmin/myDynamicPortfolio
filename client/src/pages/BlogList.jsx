import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';

export default function BlogList() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => {
                setBlogs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blogs:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-[#d0d0d0] selection:bg-cyber-neon/30 flex flex-col">
            <AnimatedBackground />

            {/* Navigation Pill */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate('/')}
                    className="pointer-events-auto group flex items-center gap-2 pill pl-4 pr-6 py-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 hover:border-cyber-neon/50 transition-all font-mono"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest text-white">Back</span>
                </motion.button>
            </nav>

            <main className="flex-1 relative pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full">

                {/* Header Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-16 md:mb-24 text-center md:text-left"
                >
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white">
                            <FileText size={24} />
                        </div>
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em]">Insights & Thoughts</p>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
                        Writings
                    </h1>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && blogs.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
                        <p className="text-zinc-500 font-mono">No articles published yet.</p>
                    </motion.div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="block group h-full glass-card overflow-hidden hover:border-cyber-neon/50 transition-colors"
                                >
                                    {blog.cover_image && (
                                        <div className="w-full aspect-video overflow-hidden border-b border-white/5 bg-zinc-900 relative">
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover brightness-75 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                                            />
                                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-600 bg-white/5 px-2 py-0.5 rounded">
                                                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyber-neon transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </main>

            <Footer />
        </div>
    );
}
