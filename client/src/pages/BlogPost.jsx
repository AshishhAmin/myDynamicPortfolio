import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';

export default function BlogPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setFetchError(null);
        fetch(`http://localhost:5000/api/blogs/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Article Not Found' : 'Server Error');
                return res.json();
            })
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blog:', err);
                setFetchError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-cyber-neon border-t-transparent rounded-full" />
        </div>
    );

    if (!blog || fetchError) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black uppercase mb-4 text-white">{fetchError || 'Article Not Found'}</h1>
            <p className="text-zinc-500 mb-8 max-w-md">
                {fetchError === 'Server Error' ? "The backend is currently experiencing issues." : "The requested article could not be found."}
            </p>
            <button onClick={() => navigate('/blog')} className="pill px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-sm transition-colors">
                Back to Blog
            </button>
        </div>
    );

    // Calculate rough read time
    const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen bg-[#050505] text-[#d0d0d0] selection:bg-cyber-neon/30">
            <AnimatedBackground />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate('/blog')}
                    className="pointer-events-auto group flex items-center gap-2 pill pl-4 pr-6 py-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 hover:border-cyber-neon/50 transition-all font-mono"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest text-white">All Articles</span>
                </motion.button>
            </nav>

            <main className="relative pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">

                {/* Header */}
                <motion.header
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-12 md:mb-16"
                >
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <Calendar size={14} />
                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <Clock size={14} />
                            {readTime} min read
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[1.1]">
                        {blog.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed border-l-2 border-cyber-neon pl-6 py-1 italic">
                        {blog.excerpt}
                    </p>
                </motion.header>

                {/* Cover Image */}
                {blog.cover_image && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full aspect-[21/9] md:aspect-[2/1] rounded-3xl overflow-hidden mb-16 border border-white/10 bg-zinc-900"
                    >
                        <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                    </motion.div>
                )}

                {/* Markdown Content */}
                <motion.article
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-cyber-neon hover:prose-a:text-white prose-a:transition-colors prose-strong:text-white prose-pre:bg-transparent prose-pre:p-0 prose-img:rounded-2xl prose-img:border prose-img:border-white/10"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <div className="rounded-xl overflow-hidden border border-white/10 my-8">
                                        <div className="bg-zinc-900 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">{match[1]}</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                            </div>
                                        </div>
                                        <SyntaxHighlighter
                                            {...props}
                                            children={String(children).replace(/\n$/, '')}
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ margin: 0, borderRadius: 0, background: '#0a0a0a', padding: '1.5rem' }}
                                        />
                                    </div>
                                ) : (
                                    <code {...props} className="bg-white/10 text-cyber-neon px-1.5 py-0.5 rounded-md font-mono text-sm">
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {blog.content}
                    </ReactMarkdown>
                </motion.article>

                <div className="mt-24 pt-8 border-t border-white/10 text-center">
                    <p className="text-zinc-500 font-mono text-sm mb-6">End of article</p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest transition-colors inline-block">
                        Back to Top
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
