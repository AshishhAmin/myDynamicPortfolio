import React, { useState, useEffect } from 'react';
import { UploadCloud, Pencil, Trash2, Plus, X, Check, ExternalLink } from 'lucide-react';
import { API_URL } from '../config';

const EMPTY_FORM = { title: '', description: '', long_description: '', tech_stack: '', live_link: '', github_link: '', size: 'small' };

export default function AdminProjectForm() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [isUploading, setUploading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchProjects = () => {
        fetch(`${API_URL}/api/projects`)
            .then(r => r.json())
            .then(setProjects)
            .catch(console.error);
    };

    useEffect(() => { fetchProjects(); }, []);

    const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingId && !file) return alert('Please attach a thumbnail image.');
        setUploading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        if (file) data.append('image', file);
        if (editingId && !file) data.append('existing_image_url', existingImageUrl);

        const url = editingId
            ? `${API_URL}/api/projects/${editingId}`
            : `${API_URL}/api/projects`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: data,
                headers: {
                    'x-admin-token': sessionStorage.getItem('adminToken')
                }
            });
            if (res.ok) {
                flash(editingId ? '✓ Project updated!' : '✓ Project published!');
                setFormData(EMPTY_FORM);
                setFile(null);
                setEditingId(null);
                setExistingImageUrl('');
                fetchProjects();
            } else flash('Upload failed — is the backend running?');
        } catch { flash('Cannot reach backend.'); }
        finally { setUploading(false); }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setExistingImageUrl(p.image_url || '');
        setFormData({
            title: p.title,
            description: p.description,
            long_description: p.long_description || '',
            tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack,
            live_link: p.live_link || '',
            github_link: p.github_link || '',
            size: p.size || 'small'
        });
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        await fetch(`${API_URL}/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-token': sessionStorage.getItem('adminToken')
            }
        });
        flash('✓ Project deleted');
        fetchProjects();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setFile(null);
        setExistingImageUrl('');
    };

    const inputCls = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30';
    const labelCls = 'block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5';

    return (
        <div className="space-y-8">
            {/* Existing Projects List */}
            {projects.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">Published Works ({projects.length})</h3>
                    {projects.map(p => (
                        <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${editingId === p.id ? 'border-white/30 bg-white/[0.05]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                            {p.image_url && (
                                <img src={p.image_url} alt={p.title} className="w-14 h-10 object-cover rounded-lg shrink-0 bg-white/5" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(Array.isArray(p.tech_stack) ? p.tech_stack : []).slice(0, 3).map(t => (
                                        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-500 border border-white/[0.05]">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {p.live_link && (
                                    <a href={p.live_link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-600 hover:text-white transition-colors"><ExternalLink size={14} /></a>
                                )}
                                <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 border border-white/[0.06] rounded-xl p-5 bg-white/[0.01]">
                <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
                    {editingId ? <><Pencil size={12} /> Editing Project</> : <><Plus size={12} /> Add New Project</>}
                </h3>

                <div>
                    <label className={labelCls}>Project Title</label>
                    <input type="text" required placeholder="e.g. Neural Chat App" value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} />
                </div>

                <div>
                    <label className={labelCls}>Brief Description</label>
                    <textarea rows={2} required placeholder="Short summary for the grid card..." value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} resize-none`} />
                </div>

                <div>
                    <label className={labelCls}>Deep Dive (Long Description)</label>
                    <textarea rows={6} placeholder="Full story: the 'why', the 'how', and the technical details..." value={formData.long_description}
                        onChange={e => setFormData({ ...formData, long_description: e.target.value })} className={`${inputCls} resize-none`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Tech Stack</label>
                        <input type="text" required placeholder="React, Node.js, Tailwind" value={formData.tech_stack}
                            onChange={e => setFormData({ ...formData, tech_stack: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Live Demo URL</label>
                        <input type="url" placeholder="https://your-project.com" value={formData.live_link}
                            onChange={e => setFormData({ ...formData, live_link: e.target.value })} className={inputCls} />
                    </div>
                </div>

                <div>
                    <label className={labelCls}>GitHub Repository URL</label>
                    <input type="url" placeholder="https://github.com/your-username/repo" value={formData.github_link}
                        onChange={e => setFormData({ ...formData, github_link: e.target.value })} className={inputCls} />
                </div>

                <div>
                    <label className={labelCls}>Thumbnail {editingId && '(leave blank to keep current)'}</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-white/[0.10] bg-white/[0.02] cursor-pointer hover:border-white/25 hover:bg-white/[0.04] transition-all">
                        <input type="file" accept="image/*" className="sr-only" onChange={e => setFile(e.target.files[0])} />
                        {editingId && existingImageUrl && !file ? (
                            <div className="flex flex-col items-center gap-1">
                                <img src={existingImageUrl} alt="current" className="h-12 object-cover rounded" />
                                <span className="text-[10px] text-zinc-600">Click to replace</span>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="text-zinc-600 mb-1" size={22} />
                                <span className="text-xs text-zinc-600">{file ? file.name : 'Click to browse'}</span>
                            </>
                        )}
                    </label>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <button type="submit" disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        <Check size={14} />
                        {isUploading ? 'Saving…' : editingId ? 'Update Project' : 'Publish Project'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] text-zinc-400 rounded-lg text-sm hover:text-white transition-colors">
                            <X size={14} /> Cancel
                        </button>
                    )}
                    {msg && <span className="text-xs text-emerald-400 font-mono ml-auto">{msg}</span>}
                </div>
            </form>
        </div>
    );
}
