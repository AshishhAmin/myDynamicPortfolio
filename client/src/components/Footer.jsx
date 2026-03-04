import React from 'react';
import { FadeUp } from './MotionPrimitives';
import { Github, Linkedin, Mail, Instagram, Download } from 'lucide-react';
import { API_URL } from '../config';

const ICON_MAP = { GitHub: Github, LinkedIn: Linkedin, Instagram: Instagram, Twitter: Instagram, Email: Mail };

const Footer = () => {
    const [contact, setContact] = React.useState({
        email: 'ashuamin480@gmail.com',
        availability_status: 'Currently open for select collaborations',
        socials: [
            { label: 'GitHub', href: '#' },
            { label: 'LinkedIn', href: '#' },
            { label: 'Instagram', href: '#' },
            { label: 'Email', href: 'mailto:ashuamin480@gmail.com' },
        ]
    });

    React.useEffect(() => {
        fetch(`${API_URL}/api/contact`)
            .then(res => res.json())
            .then(data => {
                if (data.email) {
                    const norm = (data.socials || []).map(s => s.label === 'Twitter' ? { ...s, label: 'Instagram' } : s);
                    setContact({ email: data.email, availability_status: data.availability_status || contact.availability_status, resume_url: data.resume_url || '', socials: norm.length > 0 ? norm : contact.socials });
                }
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <>
            <section id="contact" className="min-h-screen flex flex-col justify-start px-6 md:px-16 max-w-5xl mx-auto pt-32 scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">

                    {/* Left */}
                    <FadeUp>
                        <span className="section-label">Get in touch</span>
                        <h2 className="font-heading text-4xl md:text-7xl font-bold text-primary mt-4 mb-10 leading-tight">
                            Let's build<br />something great.
                        </h2>

                        <div className="flex flex-col gap-6">
                            <a href={`mailto:${contact.email}`} className="group flex flex-col gap-1 w-fit cursor-pointer">
                                <span className="text-[10px] text-text-placeholder font-mono uppercase tracking-widest">Email me at</span>
                                <span className="text-lg text-text-muted group-hover:text-primary transition-colors border-b border-border-DEFAULT group-hover:border-cta pb-1">
                                    {contact.email}
                                </span>
                            </a>

                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] text-text-muted font-body font-semibold uppercase tracking-wider">
                                        {contact.availability_status}
                                    </span>
                                </div>
                                <a
                                    href={contact.resume_url || '/resume.pdf'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary text-xs cursor-pointer"
                                >
                                    <Download size={14} /> Download Resume
                                </a>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Right */}
                    <div className="flex flex-col gap-10 pt-0 md:pt-16">
                        <FadeUp delay={0.15}>
                            <h3 className="section-label mb-5">Things I love to talk about</h3>
                            <ul className="flex flex-wrap gap-2">
                                {['Full-stack Development', 'AI Implementation', 'SaaS Architecture', 'Design Systems', 'UI/UX Strategy', 'Data Science'].map(item => (
                                    <li key={item} className="pill cursor-default">{item}</li>
                                ))}
                            </ul>
                        </FadeUp>

                        <FadeUp delay={0.3}>
                            <h3 className="section-label mb-5">Find me elsewhere</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {contact.socials.map((social) => {
                                    const Icon = ICON_MAP[social.label] || Mail;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className="card flex items-center gap-3 p-4 cursor-pointer group"
                                        >
                                            <Icon size={18} className="text-text-placeholder group-hover:text-cta transition-colors" />
                                            <span className="text-sm font-body font-medium text-text-muted group-hover:text-primary transition-colors">{social.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            <footer className="border-t border-border-DEFAULT py-10 px-6 md:px-16 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
                <p className="text-[10px] text-text-placeholder font-mono uppercase tracking-widest leading-loose text-center md:text-left">
                    © {new Date().getFullYear()} Ashish K. Amin. <br className="md:hidden" /> All rights reserved.
                    Built with React &amp; Framer Motion.
                </p>
                <div className="flex items-center gap-4 text-text-placeholder">
                    <span className="text-[10px] uppercase tracking-widest font-mono">Based in India</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
                    <span className="text-[10px] uppercase tracking-widest font-mono">UTC+5:30</span>
                </div>
            </footer>
        </>
    );
};

export default Footer;
