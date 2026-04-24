import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Plus, Pencil, Trash2, Globe, Lock, Code2, Link, Image as ImageIcon, Check, X, UploadCloud, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL = { title: '', content: '', published: false };

/* ─── Shared style tokens ─── */
const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1.5';
const saveBtnCls = 'w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer';

export default function AdminBlogForm() {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState(INITIAL);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blogs/all`);
            const data = await res.json();
            setBlogs(data);
        } catch (err) { console.error('Failed to fetch blogs:', err); }
    };

    const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3500); };

    const insertMarkdown = (syntax) =>
        setFormData(prev => ({ ...prev, content: prev.content + syntax }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = JSON.stringify({
            title: formData.title,
            content: formData.content,
            published: formData.published
        });

        const url = isEditing ? `${API_URL}/api/blogs/${editId}` : `${API_URL}/api/blogs`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: payload,
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-token': sessionStorage.getItem('adminToken') 
                },
            });
            if (res.ok) {
                flash(isEditing ? '✅ Post updated!' : '✅ Post published!');
                setFormData(INITIAL);
                setIsEditing(false);
                setEditId(null);
                fetchBlogs();
            } else {
                flash('❌ Failed to save blog.');
            }
        } catch (err) {
            console.error(err);
            flash('❌ Error saving blog.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setIsEditing(true);
        setEditId(blog.id);
        setFormData({
            title: blog.title,
            content: blog.content,
            published: blog.published
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => { setIsEditing(false); setFormData(INITIAL); setEditId(null); };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return;
        try {
            const res = await fetch(`${API_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-token': sessionStorage.getItem('adminToken') },
            });
            if (res.ok) { flash('✅ Post deleted.'); fetchBlogs(); }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8">

            {/* ── Form ─────────────────────────────────── */}
            <div className="border border-[#E4E4E7] rounded-2xl p-6 bg-white space-y-5">
                <div className="flex items-center justify-between">
                    <p className={`${labelCls} flex items-center gap-1.5`}>
                        {isEditing ? <><Pencil size={11} /> Editing Post</> : <><Plus size={11} /> New Post</>}
                    </p>
                    {isEditing && (
                        <button type="button" onClick={cancelEdit} className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer">
                            <X size={13} /> Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className={labelCls}>Post Title</label>
                        <input required type="text" value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className={inputCls} placeholder="e.g. Building a High-Performance API" />
                    </div>

                    {/* Markdown content */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelCls} style={{ marginBottom: 0 }}>Markdown Content</label>
                            {/* Toolbar */}
                            <div className="flex items-center gap-1">
                                {[
                                    { label: 'H2', action: '## ' },
                                    { label: 'B', action: '**Bold**' },
                                ].map(({ label, action }) => (
                                    <button key={label} type="button"
                                        onClick={() => insertMarkdown(action)}
                                        className="px-2 py-1 text-xs font-bold text-[#52525B] hover:bg-[#F4F4F5] rounded transition-colors cursor-pointer">
                                        {label}
                                    </button>
                                ))}
                                <button type="button" onClick={() => insertMarkdown('\n```javascript\n// code here\n```\n')}
                                    className="p-1.5 text-[#52525B] hover:bg-[#F4F4F5] rounded transition-colors cursor-pointer" title="Code Block">
                                    <Code2 size={14} />
                                </button>
                                <button type="button" onClick={() => insertMarkdown('[Link Text](https://)')}
                                    className="p-1.5 text-[#52525B] hover:bg-[#F4F4F5] rounded transition-colors cursor-pointer" title="Link">
                                    <Link size={14} />
                                </button>
                            </div>
                        </div>
                        <textarea required rows={12} value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className={`${inputCls} resize-y font-mono text-xs`}
                            placeholder="Write your post here using Markdown…" />
                    </div>

                    {/* Publish toggle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-start-2 flex flex-col justify-end">
                            <label className={labelCls}>Visibility</label>
                            <button type="button"
                                onClick={() => setFormData({ ...formData, published: !formData.published })}
                                className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-sm font-semibold cursor-pointer ${formData.published
                                        ? 'border-blue-300 bg-blue-50 text-blue-600'
                                        : 'border-[#E4E4E7] bg-[#F4F4F5] text-[#71717A] hover:border-blue-200'
                                    }`}
                            >
                                {formData.published ? <Globe size={16} /> : <Lock size={16} />}
                                {formData.published ? 'Published (Public)' : 'Draft (Private)'}
                            </button>
                        </div>
                    </div>

                    {/* Status + submit */}
                    {msg && <p className={`text-xs font-body ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
                    <button type="submit" disabled={loading} className={saveBtnCls}>
                        {loading
                            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            : <><Check size={16} /> {isEditing ? 'Update Post' : 'Create Post'}</>
                        }
                    </button>
                </form>
            </div>

            {/* ── Post list ────────────────────────────── */}
            {blogs.length > 0 && (
                <div className="space-y-3">
                    <p className={labelCls}>All Posts ({blogs.length})</p>
                    <AnimatePresence>
                        {blogs.map(blog => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${editId === blog.id ? 'border-blue-300 bg-blue-50' : 'border-[#E4E4E7] bg-[#F4F4F5]'
                                    }`}
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-white border border-[#E4E4E7] shrink-0 flex items-center justify-center">
                                    <FileText size={20} className="text-[#A1A1AA]" />
                                </div>

                                {/* Meta */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <p className="text-sm font-semibold text-[#18181B] truncate">{blog.title}</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shrink-0 ${blog.published ? 'bg-blue-100 text-blue-600' : 'bg-[#E4E4E7] text-[#71717A]'
                                            }`}>
                                            {blog.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] text-[#52525B] hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-semibold cursor-pointer"
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-100 text-[#71717A] hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
