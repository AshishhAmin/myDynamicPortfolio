import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { ArrowLeft, LayoutGrid, User, Briefcase, Wrench, Mail, Lock } from 'lucide-react';
import AdminProjectForm from '../components/AdminProjectForm';
import AboutForm from '../components/AdminForms/AboutForm';
import ExperienceForm from '../components/AdminForms/ExperienceForm';
import SkillsForm from '../components/AdminForms/SkillsForm';
import ContactForm from '../components/AdminForms/ContactForm';
import AdminBlogForm from '../components/AdminBlogForm';
import { FileText } from 'lucide-react'; // Adding icon for Blog

const TABS = [
    { id: 'works', label: 'Works', Icon: LayoutGrid },
    { id: 'about', label: 'Narrative', Icon: User },
    { id: 'journey', label: 'Journey', Icon: Briefcase },
    { id: 'skills', label: 'Toolset', Icon: Wrench },
    { id: 'blog', label: 'Blog', Icon: FileText },
    { id: 'contact', label: 'Contact', Icon: Mail },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('works');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Check for existing token on mount
    React.useEffect(() => {
        const token = sessionStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                sessionStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
            } else {
                alert(data.error || 'Incorrect passcode.');
            }
        } catch (error) {
            alert('Could not connect to the security server.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 relative">
                <div className="glass-card p-10 max-w-sm w-full text-center border-white/[0.08]">
                    <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-6 border border-white/[0.1]">
                        <Lock size={28} className="text-zinc-500" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Restricted Access</h1>
                    <p className="text-xs text-zinc-500 mb-8 lowercase tracking-wide">Enter administrative passcode</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="••••••••"
                            autoFocus
                            required
                            disabled={isLoggingIn}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-center focus:outline-none focus:ring-1 focus:ring-white/30 transition disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition disabled:opacity-50"
                        >
                            {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </form>
                    <Link to="/" className="inline-block mt-8 text-xs text-zinc-600 hover:text-white transition">← Return to site</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white py-12 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-2">Command Center</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
                            Portfolio <span className="text-shimmer">Studio</span>
                        </h1>
                    </div>
                    <Link to="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors font-mono tracking-widest uppercase mb-2">
                        <ArrowLeft size={14} /> Back to Live Site
                    </Link>
                </header>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
                                }`}
                        >
                            <tab.Icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3">
                        <div className="glass-card p-8 border-white/[0.08]">
                            {activeTab === 'works' && <AdminProjectForm />}
                            {activeTab === 'about' && <AboutForm />}
                            {activeTab === 'journey' && <ExperienceForm />}
                            {activeTab === 'skills' && <SkillsForm />}
                            {activeTab === 'blog' && <AdminBlogForm />}
                            {activeTab === 'contact' && <ContactForm />}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xs font-mono text-zinc-700 uppercase tracking-[0.2em]">Context & Tips</h3>
                        <div className="space-y-4">
                            <div className="glass-card p-6 border-white/[0.08]">
                                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Live Editing</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    All tabs now support <span className="text-zinc-300">Create, Edit, and Delete</span>. Changes sync to the database instantly — refresh the live site to see updates.
                                </p>
                            </div>
                            <div className="glass-card p-6 border-white/[0.08]">
                                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">How to Edit</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    In any tab, click the <span className="text-zinc-300">pencil icon ✏️</span> next to an entry. The form below will pre-fill with the existing data. Make your changes and click <span className="text-zinc-300">Update</span>.
                                </p>
                            </div>
                            <div className="glass-card p-6 border-white/[0.08]">
                                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Deleting</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Click the <span className="text-red-400">trash icon 🗑️</span> to remove an entry. A confirmation prompt will appear before any deletion — no accidental removals.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
