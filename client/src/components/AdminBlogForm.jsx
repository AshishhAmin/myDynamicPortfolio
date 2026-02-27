import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Lock, Code2, Link, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_FORM_STATE = { title: '', excerpt: '', content: '', published: false };

export default function AdminBlogForm() {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/blogs/all');
            const data = await res.json();
            setBlogs(data);
        } catch (err) {
            console.error('Failed to fetch blogs:', err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const insertMarkdown = (syntax) => {
        setFormData(prev => ({ ...prev, content: prev.content + syntax }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('excerpt', formData.excerpt);
        payload.append('content', formData.content);
        payload.append('published', formData.published);

        if (imageFile) {
            payload.append('cover_image', imageFile);
        } else if (isEditing && formData.cover_image) {
            payload.append('existing_cover_image', formData.cover_image);
        }

        const url = isEditing ? `http://localhost:5000/api/blogs/${editId}` : 'http://localhost:5000/api/blogs';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: payload,
                headers: {
                    'x-admin-token': sessionStorage.getItem('adminToken')
                }
            });
            if (res.ok) {
                setFormData(INITIAL_FORM_STATE);
                setImageFile(null);
                setIsEditing(false);
                setEditId(null);
                fetchBlogs();
            } else {
                alert('Failed to save blog');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving blog');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setIsEditing(true);
        setEditId(blog.id);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            published: blog.published,
            cover_image: blog.cover_image
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-admin-token': sessionStorage.getItem('adminToken')
                }
            });
            if (res.ok) fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const inputCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all font-mono text-sm";
    const labelCls = "block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2";

    return (
        <div className="space-y-12">
            {/* Form Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 border-white/10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">
                        {isEditing ? 'Edit Post' : 'New Post'}
                    </h2>
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setFormData(INITIAL_FORM_STATE); setEditId(null); }}
                            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={labelCls}>Post Title</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="e.g. Building a High-Performance API" />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelCls}>Excerpt (Short Summary)</label>
                            <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className={`${inputCls} resize-none`} placeholder="A brief description for the blog list..." />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <div className="flex justify-between items-end">
                                <label className={labelCls}>Markdown Content</label>
                                <div className="flex gap-2 mb-2">
                                    <button type="button" onClick={() => insertMarkdown('## ')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors" title="Heading 2">H2</button>
                                    <button type="button" onClick={() => insertMarkdown('**Bold**')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors font-bold" title="Bold">B</button>
                                    <button type="button" onClick={() => insertMarkdown('\n```javascript\n// code here\n```\n')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors" title="Code Block"><Code2 size={16} /></button>
                                    <button type="button" onClick={() => insertMarkdown('[Link Text](https://)')} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors" title="Link"><Link size={16} /></button>
                                </div>
                            </div>
                            <textarea required rows={12} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className={`${inputCls} resize-y font-mono text-xs`} placeholder="Write your post here using Markdown..." />
                        </div>

                        <div>
                            <label className={labelCls}>Cover Image</label>
                            <div className="relative group cursor-pointer h-[50px]">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] border border-white/10 border-dashed rounded-xl flex items-center justify-center gap-3 group-hover:border-cyber-neon transition-colors">
                                    <ImageIcon size={18} className="text-zinc-500 group-hover:text-cyber-neon transition-colors" />
                                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">
                                        {imageFile ? imageFile.name : (formData.cover_image ? 'Image Uploaded (Click to replace)' : 'Upload Cover Image')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, published: !formData.published })}
                                className={`w-full p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${formData.published ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon' : 'border-white/10 bg-[#0a0a0a] text-zinc-500 hover:border-white/30'}`}
                            >
                                {formData.published ? <Globe size={18} /> : <Lock size={18} />}
                                <span className="font-bold uppercase tracking-wider text-sm">
                                    {formData.published ? 'Published (Public)' : 'Draft (Private)'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50">
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <Plus size={18} />
                                    {isEditing ? 'Update Post' : 'Create Post'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* List Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-zinc-800" />
                    All Posts
                    <span className="w-8 h-[1px] bg-zinc-800" />
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                                        {blog.cover_image ? (
                                            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-lg text-white">{blog.title}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${blog.published ? 'bg-cyber-neon/20 text-cyber-neon' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {blog.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-500 line-clamp-1">{blog.excerpt}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                                    <button onClick={() => handleEdit(blog)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-xs font-bold uppercase tracking-wider">
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="flex-none p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
