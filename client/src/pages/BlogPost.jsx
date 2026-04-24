import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { API_URL } from '../config';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
        fetch(`${API_URL}/api/blogs/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Article Not Found' : 'Server Error');
                return res.json();
            })
            .then(data => { setBlog(data); setLoading(false); })
            .catch(err => { setFetchError(err.message); setLoading(false); });
    }, [id]);

    /* Loading state */
    if (loading) return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 border-2 border-cta border-t-transparent rounded-full" />
        </div>
    );

    /* Error state */
    if (!blog || fetchError) return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">{fetchError || 'Article Not Found'}</h1>
            <p className="text-text-muted font-body mb-8 max-w-md text-sm">
                {fetchError === 'Server Error' ? 'The backend is experiencing issues.' : 'The requested article could not be found.'}
            </p>
            <button onClick={() => navigate('/blog')} className="btn-ghost cursor-pointer">
                Back to Blog
            </button>
        </div>
    );

    const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-28 pb-24 px-6 md:px-12 max-w-[800px] mx-auto w-full">

                {/* Back link */}
                <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-primary transition-colors font-body font-semibold mb-10 cursor-pointer">
                    <ArrowLeft size={14} /> All Articles
                </Link>

                {/* Header */}
                <motion.header initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
                    {/* Meta badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border-DEFAULT text-text-muted font-mono text-xs uppercase tracking-widest shadow-sm">
                            <Calendar size={12} className="text-cta" />
                            {new Date(blog.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border-DEFAULT text-text-muted font-mono text-xs uppercase tracking-widest shadow-sm">
                            <Clock size={12} className="text-cta" />
                            {readTime} min read
                        </span>
                    </div>

                    <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Excerpt removed */}
                </motion.header>

                {/* Cover image removed */}

                {/* Markdown Article */}
                <motion.article
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="prose prose-slate prose-lg max-w-none
                        prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary
                        prose-p:text-text-muted prose-p:font-body prose-p:leading-relaxed
                        prose-a:text-cta prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-primary prose-strong:font-semibold
                        prose-blockquote:border-l-cta prose-blockquote:text-text-muted prose-blockquote:not-italic
                        prose-code:text-cta prose-code:bg-cta/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-transparent prose-pre:p-0
                        prose-img:rounded-2xl prose-img:border prose-img:border-border-DEFAULT prose-img:shadow-card
                        prose-hr:border-border-DEFAULT
                        prose-li:text-text-muted"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="rounded-2xl overflow-hidden border border-border-DEFAULT shadow-card my-6">
                                        {/* Code block header */}
                                        <div className="bg-bg-muted px-5 py-2.5 border-b border-border-DEFAULT flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-placeholder">{match[1]}</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                            </div>
                                        </div>
                                        <SyntaxHighlighter
                                            {...props}
                                            children={String(children).replace(/\n$/, '')}
                                            style={oneLight}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ margin: 0, borderRadius: 0, background: '#FFFFFF', padding: '1.5rem', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                ) : (
                                    <code {...props} className="bg-cta/8 text-cta px-1.5 py-0.5 rounded font-mono text-sm">
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {blog.content}
                    </ReactMarkdown>
                </motion.article>

                {/* Footer actions */}
                <div className="mt-16 pt-8 border-t border-border-DEFAULT flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-text-placeholder font-mono text-xs uppercase tracking-widest">End of article</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="btn-ghost text-xs cursor-pointer"
                        >
                            Back to Top ↑
                        </button>
                        <Link to="/blog" className="btn-primary text-xs cursor-pointer">
                            More Articles
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
