import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';

/* Shared input/label classes — light theme */
const inputCls = 'w-full px-4 py-3 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm font-body';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1.5';
const saveBtnCls = 'w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer';

export default function AboutForm() {
    const [description, setDescription] = useState('');
    const [isSaving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => setDescription(data.description || ''))
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            const res = await fetch(`${API_URL}/api/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('adminToken') },
                body: JSON.stringify({ description }),
            });
            setMsg(res.ok ? '✅ Saved successfully!' : '❌ Update failed.');
        } catch { setMsg('❌ Server unreachable.'); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={labelCls}>Professional Narrative</label>
                <textarea
                    rows={8}
                    required
                    placeholder="Describe your expertise, background, and what drives you..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={inputCls}
                />
            </div>
            {msg && <p className={`text-xs font-body ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
            <button type="submit" disabled={isSaving} className={saveBtnCls}>
                {isSaving ? 'Saving…' : '💾 Save Changes'}
            </button>
        </form>
    );
}
