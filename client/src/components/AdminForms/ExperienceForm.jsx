import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { Briefcase, GraduationCap, Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_FORM = { type: 'experience', title: '', organization: '', period: '', description: '' };

const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1';
const saveBtnCls = 'flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer';

export default function ExperienceForm() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchItems = () => {
        fetch(`${API_URL}/api/experience`)
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
        const url = editingId ? `${API_URL}/api/experience/${editingId}` : `${API_URL}/api/experience`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('adminToken') },
                body: JSON.stringify(formData),
            });
            flash(editingId ? '✅ Entry updated' : '✅ Entry added');
            setFormData(EMPTY_FORM);
            setEditingId(null);
            fetchItems();
        } catch { flash('❌ Error saving entry.'); }
        setLoading(false);
    };

    const handleEdit = (item) => { setEditingId(item.id); setFormData({ type: item.type, title: item.title, organization: item.organization, period: item.period, description: item.description }); };
    const handleDelete = async (id) => {
        if (!confirm('Delete this entry?')) return;
        await fetch(`${API_URL}/api/experience/${id}`, { method: 'DELETE', headers: { 'x-admin-token': sessionStorage.getItem('adminToken') } });
        flash('✅ Entry deleted');
        fetchItems();
    };
    const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); };

    return (
        <div className="space-y-6">
            {/* Existing items */}
            {items.length > 0 && (
                <div className="space-y-2">
                    <p className={labelCls}>Existing Entries ({items.length})</p>
                    {items.map(item => (
                        <div key={item.id} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${editingId === item.id ? 'border-blue-300 bg-blue-50' : 'border-[#E4E4E7] bg-[#F4F4F5]'}`}>
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={`mt-0.5 p-1.5 rounded-lg ${item.type === 'education' ? 'bg-violet-100' : 'bg-blue-100'}`}>
                                    {item.type === 'education'
                                        ? <GraduationCap size={14} className="text-violet-600" />
                                        : <Briefcase size={14} className="text-blue-600" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#18181B] truncate">{item.title}</p>
                                    <p className="text-xs text-[#71717A]">{item.organization} · {item.period}</p>
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
                    {editingId ? <><Pencil size={11} /> Editing Entry</> : <><Plus size={11} /> Add New Entry</>}
                </p>

                <div>
                    <label className={labelCls}>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className={inputCls}>
                        <option value="experience">Experience</option>
                        <option value="education">Education</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Title / Role</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Developer" required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Organization</label>
                        <input name="organization" value={formData.organization} onChange={handleChange} placeholder="Company / School" required className={inputCls} />
                    </div>
                </div>

                <div>
                    <label className={labelCls}>Period</label>
                    <input name="period" value={formData.period} onChange={handleChange} placeholder="e.g. 2022 - Present" required className={inputCls} />
                </div>

                <div>
                    <label className={labelCls}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe your role…" rows={3} className={`${inputCls} resize-none`} />
                </div>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <button type="submit" disabled={loading} className={saveBtnCls}>
                        <Check size={14} />
                        {loading ? 'Saving…' : editingId ? 'Update Entry' : 'Add Entry'}
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
