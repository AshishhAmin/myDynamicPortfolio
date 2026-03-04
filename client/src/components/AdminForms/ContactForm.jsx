import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { FileText } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-sm font-body';
const labelCls = 'block text-[11px] font-bold text-[#52525B] uppercase tracking-widest mb-1.5';
const saveBtnCls = 'w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer';

export default function ContactForm() {
    const [data, setData] = useState({ email: '', availability_status: '', resume_url: '', socials: [] });
    const [isSaving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/contact`)
            .then(res => res.json())
            .then(fetched => {
                const socials = (fetched.socials || [
                    { label: 'GitHub', href: '' },
                    { label: 'LinkedIn', href: '' },
                    { label: 'Instagram', href: '' }
                ]).map(s => s.label === 'Twitter' ? { ...s, label: 'Instagram' } : s);
                setData({ email: fetched.email || '', availability_status: fetched.availability_status || '', resume_url: fetched.resume_url || '', socials });
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': sessionStorage.getItem('adminToken') },
                body: JSON.stringify(data),
            });
            setMsg(res.ok ? '✅ Contact updated!' : '❌ Update failed.');
        } catch { setMsg('❌ Server unreachable.'); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Public Email</label>
                    <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                    <label className={labelCls}>Availability Status</label>
                    <input type="text" value={data.availability_status} onChange={e => setData({ ...data, availability_status: e.target.value })} className={inputCls} placeholder="Open to work…" />
                </div>
            </div>

            {/* Resume URL */}
            <div>
                <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5"><FileText size={11} /> Resume / CV URL</span>
                </label>
                <input
                    type="url"
                    value={data.resume_url}
                    onChange={e => setData({ ...data, resume_url: e.target.value })}
                    className={inputCls}
                    placeholder="https://drive.google.com/… or /resume.pdf"
                />
                <p className="text-[10px] text-[#A1A1AA] mt-1 font-body">Paste a Google Drive link, Dropbox link, or path to a PDF. This appears on the Download Resume button in the contact section.</p>
            </div>

            <div className="space-y-3">
                <label className={labelCls}>Social Links</label>
                {data.socials.map((social, idx) => (
                    <div key={social.label} className="flex items-center gap-3">
                        <span className="w-20 text-[11px] text-[#52525B] font-mono font-bold uppercase shrink-0">{social.label}</span>
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

            {msg && <p className={`text-xs font-body ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
            <button type="submit" disabled={isSaving} className={saveBtnCls}>
                {isSaving ? 'Saving…' : '📫 Update Contact'}
            </button>
        </form>
    );
}
