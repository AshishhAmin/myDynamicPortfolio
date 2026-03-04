import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import { FadeUp } from './MotionPrimitives';

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => { setBlogs(Array.isArray(data) ? data.slice(0, 3) : []); setLoading(false); })
            .catch(() => { setLoading(false); });
    }, []);

    return (
        <section id="blog" className="min-h-[90dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1200px] w-full mx-auto pt-24 pb-12 relative scroll-mt-32">
            <FadeUp className="mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="section-label">Technical Insights</span>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 tracking-tight">
                        Latest Writings
                    </h2>
                </div>
                <Link to="/blog" className="btn-ghost text-xs cursor-pointer">
                    View All Articles <ArrowUpRight size={15} />
                </Link>
            </FadeUp>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                {loading ? (
                    <div className="col-span-1 md:col-span-3 flex justify-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="col-span-1 md:col-span-3 text-center py-20 border border-border-DEFAULT rounded-3xl bg-white">
                        <p className="text-text-muted font-body text-sm">No articles published yet.</p>
                    </div>
                ) : (
                    blogs.map((blog, idx) => (
                        <FadeUp key={blog.id} delay={0.1 * idx} className="h-full">
                            <Link to={`/blog/${blog.id}`} className="card flex flex-col h-full overflow-hidden cursor-pointer group block">
                                {blog.cover_image ? (
                                    <div className="w-full aspect-video overflow-hidden border-b border-border-DEFAULT relative bg-bg-muted shrink-0">
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video border-b border-border-DEFAULT flex items-center justify-center bg-bg-muted shrink-0 text-border-strong">
                                        <FileText size={44} />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-placeholder mb-3">
                                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <h3 className="font-heading text-lg md:text-xl font-bold text-primary mb-2 group-hover:text-cta transition-colors line-clamp-2 leading-snug">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-text-muted line-clamp-3 mb-5 leading-relaxed font-body font-light flex-1">
                                        {blog.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-xs font-body font-bold uppercase tracking-widest text-text-muted group-hover:text-cta transition-colors">
                                        Read Article <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
