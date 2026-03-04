import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_FORM = { category: '', skillsString: '' };

const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1';
const saveBtnCls = 'flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer';

export default function SkillsForm() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchItems = () => {
        fetch(`${API_URL}/api/skills`).then(r => r.json()).then(setItems).catch(console.error);
    };
    useEffect(() => { fetchItems(); }, []);

    const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };
    const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editingId ? `${API_URL}/api/skills/${editingId}` : `${API_URL}/api/skills`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('adminToken') },
                body: JSON.stringify({ category: formData.category, skills: formData.skillsString }),
            });
            flash(editingId ? '✅ Category updated' : '✅ Category added');
            setFormData(EMPTY_FORM);
            setEditingId(null);
            fetchItems();
        } catch { flash('❌ Error saving.'); }
        setLoading(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setFormData({ category: item.category, skillsString: item.skills.join(', ') }); };
    const handleDelete = async (id) => {
        if (!confirm('Delete this skill category?')) return;
        await fetch(`${API_URL}/api/skills/${id}`, { method: 'DELETE', headers: { 'x-admin-token': sessionStorage.getItem('adminToken') } });
        flash('✅ Category deleted');
        fetchItems();
    };
    const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); };

    return (
        <div className="space-y-6">
            {/* Existing items */}
            {items.length > 0 && (
                <div className="space-y-2">
                    <p className={labelCls}>Existing Categories ({items.length})</p>
                    {items.map(item => (
                        <div key={item.id} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${editingId === item.id ? 'border-blue-300 bg-blue-50' : 'border-[#E4E4E7] bg-[#F4F4F5]'}`}>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#18181B] mb-1.5">{item.category}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.skills.map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-white text-xs text-[#52525B] border border-[#E4E4E7]">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-100 text-[#71717A] hover:text-blue-600 transition-colors cursor-pointer"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-[#71717A] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 border border-[#E4E4E7] rounded-2xl p-5 bg-white">
                <p className={`${labelCls} flex items-center gap-1.5`}>
                    {editingId ? <><Pencil size={11} /> Editing Category</> : <><Plus size={11} /> Add New Category</>}
                </p>

                <div>
                    <label className={labelCls}>Category Name</label>
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Engineering" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Skills (comma-separated)</label>
                    <textarea name="skillsString" value={formData.skillsString} onChange={handleChange} placeholder="React, Node.js, PostgreSQL…" required rows={3} className={`${inputCls} resize-none`} />
                </div>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <button type="submit" disabled={loading} className={saveBtnCls}>
                        <Check size={14} />
                        {loading ? 'Saving…' : editingId ? 'Update Category' : 'Add Category'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-[#F4F4F5] text-[#52525B] rounded-xl text-sm hover:bg-[#E4E4E7] transition-colors cursor-pointer">
                            <X size={14} /> Cancel
                        </button>
                    )}
                    {msg && <span className={`text-xs font-mono ml-auto ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</span>}
                </div>
            </form>
        </div>
    );
}
