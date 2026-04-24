import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function BlogList() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-28 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">

                {/* Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-14 md:mb-20"
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors font-body font-semibold mb-8 cursor-pointer">
                        <ArrowLeft size={14} /> Back to home
                    </Link>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-border-DEFAULT shadow-card flex items-center justify-center">
                            <FileText size={20} className="text-cta" />
                        </div>
                        <span className="section-label">Insights &amp; Thoughts</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary tracking-tight">
                        Writings
                    </h1>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-cta border-t-transparent rounded-full" />
                    </div>
                )}

                {/* Empty */}
                {!loading && blogs.length === 0 && (
                    <div className="text-center py-20 border border-border-DEFAULT rounded-3xl bg-white">
                        <p className="text-text-muted font-body">No articles published yet.</p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AnimatePresence>
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="card flex flex-col h-full overflow-hidden cursor-pointer group block"
                                >
                                    {/* Image section removed */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-placeholder mb-3 bg-bg-muted px-2 py-0.5 rounded w-fit">
                                            {new Date(blog.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <h2 className="font-heading text-xl md:text-2xl font-bold text-primary mb-2 group-hover:text-cta transition-colors line-clamp-2 leading-snug">
                                            {blog.title}
                                        </h2>
                                        <div className="flex-1 mb-4"></div>
                                        <div className="flex items-center gap-1.5 text-xs font-body font-bold uppercase tracking-widest text-text-placeholder group-hover:text-cta transition-colors mt-auto">
                                            Read Article <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
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
