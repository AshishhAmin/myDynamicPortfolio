import React, { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_FORM = { type: 'experience', title: '', organization: '', period: '', description: '' };

export default function ExperienceForm() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchItems = () => {
        fetch('http://localhost:5000/api/experience')
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
            ? `http://localhost:5000/api/experience/${editingId}`
            : 'http://localhost:5000/api/experience';
        const method = editingId ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': sessionStorage.getItem('adminToken')
                },
                body: JSON.stringify(formData),
            });
            flash(editingId ? '✓ Entry updated' : '✓ Entry added');
            setFormData(EMPTY_FORM);
            setEditingId(null);
            fetchItems();
        } catch { flash('Error saving entry.'); }
        setLoading(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ type: item.type, title: item.title, organization: item.organization, period: item.period, description: item.description });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this entry?')) return;
        await fetch(`http://localhost:5000/api/experience/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-token': sessionStorage.getItem('adminToken')
            }
        });
        flash('✓ Entry deleted');
        fetchItems();
    };

    const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); };

    const inputCls = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30';

    return (
        <div className="space-y-8">
            {/* Existing Items List */}
            {items.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">Existing Entries ({items.length})</h3>
                    {items.map(item => (
                        <div key={item.id} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${editingId === item.id ? 'border-white/30 bg-white/[0.05]' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05]">
                                    {item.type === 'education' ? <GraduationCap size={14} className="text-zinc-400" /> : <Briefcase size={14} className="text-zinc-400" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                    <p className="text-xs text-zinc-500">{item.organization} · {item.period}</p>
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
                    {editingId ? <><Pencil size={12} /> Editing Entry</> : <><Plus size={12} /> Add New Entry</>}
                </h3>

                <select name="type" value={formData.type} onChange={handleChange} className={inputCls}>
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title / Role" required className={inputCls} />
                    <input name="organization" value={formData.organization} onChange={handleChange} placeholder="Organization / School" required className={inputCls} />
                </div>

                <input name="period" value={formData.period} onChange={handleChange} placeholder="Period (e.g. 2022 - Present)" required className={inputCls} />

                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (optional)" rows={3} className={`${inputCls} resize-none`} />

                <div className="flex items-center gap-3 pt-1">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        <Check size={14} />
                        {loading ? 'Saving…' : editingId ? 'Update Entry' : 'Add Entry'}
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
