import React, { useState, useEffect } from 'react';
import { UploadCloud, Pencil, Trash2, Plus, X, Check, ExternalLink } from 'lucide-react';
import { API_URL } from '../config';

const EMPTY_FORM = {
    title: '',
    long_description: '',
    tech_stack: '',
    live_link: '',
    github_link: '',
    size: 'small',
};

/* ── Shared style tokens ──────────────────────────── */
const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1.5';
const saveBtnCls = 'flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer';

export default function AdminProjectForm() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [isUploading, setUploading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchProjects = () => {
        fetch(`${API_URL}/api/projects`).then(r => r.json()).then(setProjects).catch(console.error);
    };
    useEffect(() => { fetchProjects(); }, []);

    const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3500); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingId && !file) { flash('❌ Please attach a thumbnail image.'); return; }
        setUploading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        if (file) data.append('image', file);
        if (editingId && !file) data.append('existing_image_url', existingImageUrl);

        const url = editingId ? `${API_URL}/api/projects/${editingId}` : `${API_URL}/api/projects`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                body: data,
                headers: { 'x-admin-token': sessionStorage.getItem('adminToken') },
            });
            if (res.ok) {
                flash(editingId ? '✅ Project updated!' : '✅ Project published!');
                setFormData(EMPTY_FORM);
                setFile(null);
                setEditingId(null);
                setExistingImageUrl('');
                fetchProjects();
            } else {
                flash('❌ Upload failed — is the backend running?');
            }
        } catch { flash('❌ Cannot reach backend.'); }
        finally { setUploading(false); }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setExistingImageUrl(p.image_url || '');
        setFormData({
            title: p.title,
            long_description: p.long_description || '',
            tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack,
            live_link: p.live_link || '',
            github_link: p.github_link || '',
            size: p.size || 'small',
        });
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        await fetch(`${API_URL}/api/projects/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-token': sessionStorage.getItem('adminToken') },
        });
        flash('✅ Project deleted');
        fetchProjects();
    };

    const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); setFile(null); setExistingImageUrl(''); };

    const field = (key) => ({ value: formData[key], onChange: (e) => setFormData({ ...formData, [key]: e.target.value }) });

    return (
        <div className="space-y-6">

            {/* ── Existing projects list ────────────────────── */}
            {projects.length > 0 && (
                <div className="space-y-2">
                    <p className={labelCls}>Published Works ({projects.length})</p>
                    {projects.map(p => (
                        <div
                            key={p.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${editingId === p.id
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-[#E4E4E7] bg-[#F4F4F5]'
                                }`}
                        >
                            {p.image_url && (
                                <img src={p.image_url} alt={p.title} className="w-14 h-10 object-cover rounded-lg shrink-0 border border-[#E4E4E7] bg-[#F4F4F5]" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#18181B] truncate">{p.title}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(Array.isArray(p.tech_stack) ? p.tech_stack : []).slice(0, 3).map(t => (
                                        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white text-[#52525B] border border-[#E4E4E7]">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {p.live_link && (
                                    <a href={p.live_link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-blue-100 text-[#71717A] hover:text-blue-600 transition-colors cursor-pointer">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-100 text-[#71717A] hover:text-blue-600 transition-colors cursor-pointer">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-[#71717A] hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Form ─────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-5 border border-[#E4E4E7] rounded-2xl p-5 bg-white">
                <p className={`${labelCls} flex items-center gap-1.5`}>
                    {editingId ? <><Pencil size={11} /> Editing Project</> : <><Plus size={11} /> Add New Project</>}
                </p>

                <div>
                    <label className={labelCls}>Project Title</label>
                    <input type="text" required placeholder="e.g. Neural Chat App" className={inputCls} {...field('title')} />
                </div>

                {/* Brief description removed */}

                <div>
                    <label className={labelCls}>Project Details (Long Description)</label>
                    <textarea rows={5} placeholder="Full story: the 'why', the 'how', and technical details…" className={`${inputCls} resize-none`} {...field('long_description')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Tech Stack (comma-separated)</label>
                        <input type="text" required placeholder="React, Node.js, Tailwind" className={inputCls} {...field('tech_stack')} />
                    </div>
                    <div>
                        <label className={labelCls}>Live Demo URL</label>
                        <input type="url" placeholder="https://your-project.com" className={inputCls} {...field('live_link')} />
                    </div>
                </div>

                <div>
                    <label className={labelCls}>GitHub Repository URL</label>
                    <input type="url" placeholder="https://github.com/username/repo" className={inputCls} {...field('github_link')} />
                </div>

                {/* Thumbnail uploader */}
                <div>
                    <label className={labelCls}>
                        Thumbnail {editingId && <span className="normal-case font-normal text-[#A1A1AA]">(leave blank to keep current)</span>}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-[#E4E4E7] bg-[#F4F4F5] cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <input type="file" accept="image/*" className="sr-only" onChange={e => setFile(e.target.files[0])} />
                        {editingId && existingImageUrl && !file ? (
                            <div className="flex flex-col items-center gap-1.5">
                                <img src={existingImageUrl} alt="current" className="h-12 object-cover rounded border border-[#E4E4E7]" />
                                <span className="text-[10px] text-[#A1A1AA] font-body">Click to replace</span>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="text-[#A1A1AA] mb-1.5" size={22} />
                                <span className="text-xs text-[#71717A] font-body">{file ? file.name : 'Click to browse'}</span>
                            </>
                        )}
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <button type="submit" disabled={isUploading} className={saveBtnCls}>
                        <Check size={14} />
                        {isUploading ? 'Saving…' : editingId ? 'Update Project' : 'Publish Project'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-[#F4F4F5] text-[#52525B] rounded-xl text-sm hover:bg-[#E4E4E7] transition-colors cursor-pointer">
                            <X size={14} /> Cancel
                        </button>
                    )}
                    {msg && (
                        <span className={`text-xs font-mono ml-auto ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                            {msg}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
