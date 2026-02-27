import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';

export default function ContactForm() {
    const [data, setData] = useState({
        email: '',
        availability_status: '',
        socials: [] // [{ label: '', href: '' }]
    });
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/contact`)
            .then(res => res.json())
            .then(fetched => {
                const socials = fetched.socials || [
                    { label: 'GitHub', href: '' },
                    { label: 'LinkedIn', href: '' },
                    { label: 'Instagram', href: '' }
                ];
                const normalizedSocials = socials.map(s =>
                    s.label === 'Twitter' ? { ...s, label: 'Instagram' } : s
                );
                setData({
                    email: fetched.email || '',
                    availability_status: fetched.availability_status || '',
                    socials: normalizedSocials
                });
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': sessionStorage.getItem('adminToken')
                },
                body: JSON.stringify(data),
            });
            if (res.ok) alert('Contact details updated! 📫');
            else alert('Update failed.');
        } catch { alert('Server unreachable.'); }
        finally { setSaving(false); }
    };

    const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.10] text-ink-50 placeholder-ink-500 focus:outline-none transition text-xs';
    const labelCls = 'block text-[10px] font-semibold text-ink-300 uppercase tracking-widest mb-1.5';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Public Email</label>
                    <input type="email" value={data.email}
                        onChange={e => setData({ ...data, email: e.target.value })}
                        className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Availability Status</label>
                    <input type="text" value={data.availability_status}
                        onChange={e => setData({ ...data, availability_status: e.target.value })}
                        className={inputCls} />
                </div>
            </div>

            <div className="space-y-4">
                <label className={labelCls}>Social Presence</label>
                {data.socials.map((social, idx) => (
                    <div key={social.label} className="flex items-center gap-3">
                        <span className="w-20 text-[10px] text-zinc-500 font-mono uppercase">{social.label}</span>
                        <input
                            type="text"
                            placeholder="Profile URL"
                            value={social.href}
                            onChange={e => {
                                const newSocials = [...data.socials];
                                newSocials[idx].href = e.target.value;
                                setData({ ...data, socials: newSocials });
                            }}
                            className={inputCls}
                        />
                    </div>
                ))}
            </div>

            <button type="submit" disabled={isSaving}
                className="w-full py-3.5 rounded-2xl bg-white text-ink-900 font-bold text-sm tracking-wide hover:bg-ink-50 transition-all disabled:opacity-50">
                {isSaving ? 'Saving...' : '📫 Update Global Contact'}
            </button>
        </form>
    );
}
