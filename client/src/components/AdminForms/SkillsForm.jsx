import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_FORM = { category: '', skillsString: '' };

export default function SkillsForm() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchItems = () => {
        fetch(`${API_URL}/api/skills`)
            .then(r => r.json())
            .then(setItems)
            .catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

    const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editingId
            ? `${API_URL}/api/skills/${editingId}`
            : `${API_URL}/api/skills`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': sessionStorage.getItem('adminToken')
                },
                body: JSON.stringify({ category: formData.category, skills: formData.skillsString }),
            });
            flash(editingId ? '✓ Category updated' : '✓ Category added');
            setFormData(EMPTY_FORM);
            setEditingId(null);
            fetchItems();
        } catch { flash('Error saving.'); }
        setLoading(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ category: item.category, skillsString: item.skills.join(', ') });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this skill category?')) return;
        await fetch(`${API_URL}/api/skills/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-token': sessionStorage.getItem('adminToken')
            }
        });
        flash('✓ Category deleted');
        fetchItems();
    };

    const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); };

    const inputCls = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30';

    return (
        <div className="space-y-8">
            {/* Existing Items List */}
            {items.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">Existing Categories ({items.length})</h3>
                    {items.map(item => (
                        <div key={item.id} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${editingId === item.id ? 'border-white/30 bg-white/[0.05]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white mb-1">{item.category}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.skills.map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-xs text-zinc-500 border border-white/[0.06]">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 border border-white/[0.06] rounded-xl p-5 bg-white/[0.01]">
                <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
                    {editingId ? <><Pencil size={12} /> Editing Category</> : <><Plus size={12} /> Add New Category</>}
                </h3>

                <input name="category" value={formData.category} onChange={handleChange} placeholder="Category Name (e.g. Engineering)" required className={inputCls} />
                <textarea name="skillsString" value={formData.skillsString} onChange={handleChange} placeholder="Skills (comma-separated, e.g. React, Node.js, PostgreSQL)" required rows={3} className={`${inputCls} resize-none`} />

                <div className="flex items-center gap-3 pt-1">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        <Check size={14} />
                        {loading ? 'Saving…' : editingId ? 'Update Category' : 'Add Category'}
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
