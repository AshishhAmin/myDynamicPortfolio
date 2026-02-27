import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import { FadeUp } from './MotionPrimitives';

const BlogSection = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => {
                // Only take the first 3 for the preview on home screen
                setBlogs(Array.isArray(data) ? data.slice(0, 3) : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blogs:', err);
                setLoading(false);
            });
    }, []);

    return (
        <section id="blog" className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1400px] w-full mx-auto pt-24 pb-12 relative scroll-mt-32">
            {/* Section Header */}
            <FadeUp className="mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[11px] md:text-sm text-zinc-500 tracking-[0.3em] uppercase mb-2 lg:mb-4">Technical Insights</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Latest Writings
                    </h2>
                </div>
                <Link to="/blog" className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-neon transition-colors flex items-center gap-2">
                    View All Articles <ArrowUpRight size={16} className="md:w-5 md:h-5" />
                </Link>
            </FadeUp>

            {/* Content grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-1 md:col-span-3 flex justify-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="col-span-1 md:col-span-3 text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
                        <p className="text-zinc-500 font-mono text-sm">No articles published yet.</p>
                    </div>
                ) : (
                    blogs.map((blog, idx) => (
                        <FadeUp key={blog.id} delay={0.1 * idx} className="h-full">
                            <Link
                                to={`/blog/${blog.id}`}
                                className="group h-full flex flex-col glass-card overflow-hidden hover:border-cyber-neon/50 transition-colors bg-white/[0.02]"
                            >
                                {blog.cover_image ? (
                                    <div className="w-full aspect-[4/3] overflow-hidden border-b border-white/5 relative bg-zinc-900 shrink-0">
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover brightness-75 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[4/3] border-b border-white/5 flex items-center justify-center bg-zinc-900 shrink-0 text-zinc-700">
                                        <FileText size={48} />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4 lg:mb-5">
                                        <span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-widest text-zinc-600">
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 lg:mb-3 group-hover:text-cyber-neon transition-colors line-clamp-2 leading-tight">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-zinc-500 line-clamp-3 mb-6 lg:mb-8 leading-relaxed font-light">
                                        {blog.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 lg:gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                        Read Article <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform lg:w-4 lg:h-4" />
                                    </div>
                                </div>
                            </Link>
                        </FadeUp>
                    ))
                )}
            </div>
        </section>
    );
};

export default BlogSection;
