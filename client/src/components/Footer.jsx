import React from 'react';
import { FadeUp } from './MotionPrimitives';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { API_URL } from '../config';

const socials = [
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Mail, href: 'mailto:ashuamin480@gmail.com', label: 'Email' },
];

const ICON_MAP = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Instagram: Instagram,
    Twitter: Instagram, // Legacy fallback
    Email: Mail
};

const Footer = () => {
    const [contact, setContact] = React.useState({
        email: 'ashuamin480@gmail.com',
        availability_status: 'Currently open for select collaborations',
        socials: [
            { label: 'GitHub', href: '#' },
            { label: 'LinkedIn', href: '#' },
            { label: 'Instagram', href: '#' },
            { label: 'Email', href: 'mailto:ashuamin480@gmail.com' }
        ]
    });

    React.useEffect(() => {
        fetch(`${API_URL}/api/contact`)
            .then(res => res.json())
            .then(data => {
                if (data.email) {
                    // Normalize legacy "Twitter" data to "Instagram"
                    const normalizedSocials = (data.socials || []).map(s =>
                        s.label === 'Twitter' ? { ...s, label: 'Instagram' } : s
                    );
                    setContact({
                        email: data.email,
                        availability_status: data.availability_status || contact.availability_status,
                        socials: normalizedSocials.length > 0 ? normalizedSocials : contact.socials
                    });
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <>
            <section id="contact" className="min-h-screen flex flex-col justify-start px-6 md:px-16 max-w-5xl mx-auto pt-32 scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <FadeUp>
                        <p className="text-[11px] text-zinc-600 tracking-[0.3em] uppercase mb-6">Get in touch</p>
                        <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-10 leading-tight">
                            Let's build<br />something great.
                        </h2>

                        <div className="flex flex-col gap-6">
                            <a
                                href={`mailto:${contact.email}`}
                                className="group flex flex-col gap-1 w-fit"
                            >
                                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Email me at</span>
                                <span className="text-lg text-zinc-400 group-hover:text-white transition-colors border-b border-zinc-900 group-hover:border-white pb-1">
                                    {contact.email}
                                </span>
                            </a>

                            <div className="flex items-center gap-2 mt-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                                    {contact.availability_status}
                                </span>
                            </div>
                        </div>
                    </FadeUp>

                    <div className="flex flex-col gap-12 pt-0 md:pt-16">
                        <FadeUp delay={0.2}>
                            <h3 className="text-xs font-mono text-zinc-700 tracking-[0.2em] uppercase mb-6">Things I love to talk about</h3>
                            <ul className="flex flex-wrap gap-2">
                                {['Full-stack Development', 'AI Implementation', 'SaaS Architecture', 'Design Systems', 'UI/UX Strategy', 'Data Science'].map(item => (
                                    <li key={item} className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-xs text-zinc-500 uppercase tracking-wide">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>

                        <FadeUp delay={0.4}>
                            <h3 className="text-xs font-mono text-zinc-700 tracking-[0.2em] uppercase mb-6">Find me elsewhere</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {contact.socials.map((social) => {
                                    const Icon = ICON_MAP[social.label] || Mail;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                                        >
                                            <Icon size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                                            <span className="text-sm text-zinc-500 group-hover:text-white transition-colors">{social.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            <footer className="border-t border-zinc-900/50 py-10 px-6 md:px-16 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest leading-loose text-center md:text-left">
                    © {new Date().getFullYear()} Ashish K. Amin. <br className="md:hidden" /> All rights reserved.
                    Built with React & Framer Motion.
                </p>
                <div className="flex items-center gap-4 text-zinc-800">
                    <span className="text-[10px] uppercase tracking-widest font-mono">Based in India</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <span className="text-[10px] uppercase tracking-widest font-mono">UTC+5:30</span>
                </div>
            </footer>
        </>
    );
};

export default Footer;
