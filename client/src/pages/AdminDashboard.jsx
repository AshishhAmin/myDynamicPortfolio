import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { ArrowLeft, LayoutGrid, User, Briefcase, Wrench, Mail, Lock, FileText, ShieldCheck } from 'lucide-react';
import AdminProjectForm from '../components/AdminProjectForm';
import AboutForm from '../components/AdminForms/AboutForm';
import ExperienceForm from '../components/AdminForms/ExperienceForm';
import SkillsForm from '../components/AdminForms/SkillsForm';
import ContactForm from '../components/AdminForms/ContactForm';
import AdminBlogForm from '../components/AdminBlogForm';
import AnimatedBackground from '../components/AnimatedBackground';

const TABS = [
    { id: 'works', label: 'Works', Icon: LayoutGrid },
    { id: 'about', label: 'Narrative', Icon: User },
    { id: 'journey', label: 'Journey', Icon: Briefcase },
    { id: 'skills', label: 'Toolset', Icon: Wrench },
    { id: 'blog', label: 'Blog', Icon: FileText },
    { id: 'contact', label: 'Contact', Icon: Mail },
];

const TIP_CARDS = [
    {
        title: 'Live Editing',
        body: 'All tabs support Create, Edit, and Delete. Changes sync to the database instantly — refresh the live site to see updates.',
    },
    {
        title: 'How to Edit',
        body: 'In any tab, click the pencil icon next to an entry. The form will pre-fill with existing data. Make changes and click Update.',
    },
    {
        title: 'Deleting',
        body: 'Click the trash icon to remove an entry. A confirmation prompt will appear before any deletion.',
    },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('works');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    React.useEffect(() => {
        if (sessionStorage.getItem('adminToken')) setIsAuthenticated(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');
        try {
            const res = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
            const data = await res.json();
            if (res.ok && data.token) {
                sessionStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
            } else {
                setLoginError(data.error || 'Incorrect passcode.');
            }
        } catch {
            setLoginError('Could not reach server.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    /* ── Login screen ─────────────────────────────────── */
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
                <AnimatedBackground />
                <div className="card p-8 max-w-sm w-full text-center">
                    <div className="w-14 h-14 rounded-2xl bg-cta/10 border border-cta/20 flex items-center justify-center mx-auto mb-5">
                        <Lock size={24} className="text-cta" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-primary mb-1">Restricted Access</h1>
                    <p className="text-xs text-text-placeholder font-body mb-7 tracking-wide">Enter your administrative passcode</p>

                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            type="password"
                            placeholder="••••••••"
                            autoFocus
                            required
                            disabled={isLoggingIn}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-bg-muted border border-border-DEFAULT text-center text-primary font-body placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta/40 transition disabled:opacity-50 text-sm"
                        />
                        {loginError && (
                            <p className="text-xs text-red-500 font-body">{loginError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="btn-primary w-full justify-center py-3 text-sm cursor-pointer"
                        >
                            <ShieldCheck size={16} />
                            {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </form>
                    <Link to="/" className="inline-block mt-6 text-xs text-text-placeholder hover:text-primary transition-colors cursor-pointer">
                        ← Return to site
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Dashboard ─────────────────────────────────────── */
    return (
        <div className="min-h-screen py-10 px-4 md:px-8">
            <AnimatedBackground />
            <div className="max-w-[1200px] mx-auto relative">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <span className="section-label">Command Center</span>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mt-2 tracking-tight">
                            Portfolio <span className="text-cta">Studio</span>
                        </h1>
                    </div>
                    <Link to="/" className="btn-ghost text-xs cursor-pointer">
                        <ArrowLeft size={14} /> Back to Live Site
                    </Link>
                </header>

                {/* Tab bar */}
                <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1.5 rounded-2xl bg-white border border-border-DEFAULT shadow-card w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-semibold transition-all cursor-pointer ${activeTab === tab.id
                                ? 'bg-cta text-white shadow-cta'
                                : 'text-text-muted hover:text-primary hover:bg-bg-muted'
                                }`}
                        >
                            <tab.Icon size={13} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <div className="card p-6 md:p-8">
                            {activeTab === 'works' && <AdminProjectForm />}
                            {activeTab === 'about' && <AboutForm />}
                            {activeTab === 'journey' && <ExperienceForm />}
                            {activeTab === 'skills' && <SkillsForm />}
                            {activeTab === 'blog' && <AdminBlogForm />}
                            {activeTab === 'contact' && <ContactForm />}
                        </div>
                    </div>

                    {/* Tips sidebar */}
                    <div className="lg:col-span-2 space-y-4">
                        <span className="section-label">Context &amp; Tips</span>
                        {TIP_CARDS.map(({ title, body }) => (
                            <div key={title} className="card p-5">
                                <h4 className="text-xs font-body font-bold text-primary uppercase tracking-wider mb-2">{title}</h4>
                                <p className="text-xs text-text-muted font-body leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


