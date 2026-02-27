import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';

export default function AboutForm() {
    const [description, setDescription] = useState('');
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => setDescription(data.description || ''))
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/about`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': sessionStorage.getItem('adminToken')
                },
                body: JSON.stringify({ description }),
            });
            if (res.ok) alert('About section updated! ✨');
            else alert('Update failed.');
        } catch { alert('Server unreachable.'); }
        finally { setSaving(false); }
    };

    const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-ink-50 placeholder-ink-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition text-sm';
    const labelCls = 'block text-[10px] font-semibold text-ink-300 uppercase tracking-widest mb-1.5';

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={labelCls}>Professional Narrative</label>
                <textarea
                    rows={8}
                    required
                    placeholder="Describe your expertise..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={inputCls}
                />
            </div>
            <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl bg-white text-ink-900 font-bold text-sm tracking-wide hover:bg-ink-50 transition-all disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : '💾 Save Changes'}
            </button>
        </form>
    );
}
