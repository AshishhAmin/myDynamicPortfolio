import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { label: 'About', href: '/#about' },
    { label: 'Works', href: '/#projects' },
    { label: 'Journey', href: '/#experience' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Blog', href: '/#blog' },
    { label: 'Contact', href: '/#contact' },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeId, setActiveId] = useState('');
    const location = useLocation();

    /* ── Scroll-aware background ──────────────────────── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Active section via IntersectionObserver ─────── */
    useEffect(() => {
        if (location.pathname !== '/') return; // only on home page
        const ids = ['about', 'projects', 'experience', 'skills', 'blog', 'contact'];
        const observers = ids.map(id => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
                { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach(obs => obs?.disconnect());
    }, [location.pathname]);

    /* ── Active check ────────────────────────────────── */
    const isActive = (href) => {
        // On non-home pages, highlight by pathname
        if (location.pathname !== '/') {
            if (href === '/#blog' && location.pathname.startsWith('/blog')) return true;
            if (href === '/#experience' && location.pathname.startsWith('/experience')) return true;
            return false;
        }
        const id = href.replace('/#', '');
        return activeId === id;
    };

    const navClass = scrolled
        ? 'bg-white/95 border-border-DEFAULT shadow-card'
        : 'bg-white/70 border-border-subtle shadow-sm';

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, delay: 0.15 }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 md:px-6 pt-4"
        >
            <nav className={`w-full max-w-3xl flex items-center justify-between px-5 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-500 ${navClass}`}>

                {/* Logo */}
                <Link to="/" className="font-heading text-base font-semibold tracking-widest text-text-muted hover:text-primary transition-colors duration-200 shrink-0 cursor-pointer">
                    portfolio
                </Link>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                    {NAV_LINKS.map(l => {
                        const active = isActive(l.href);
                        return (
                            <li key={l.label} className="relative">
                                <a
                                    href={l.href}
                                    className={`relative text-xs font-body font-semibold tracking-wide transition-colors duration-200 cursor-pointer py-1 px-0.5 ${active ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                >
                                    {l.label}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-cta rounded-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                        />
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* Right: CTA + hamburger */}
                <div className="flex items-center gap-3">
                    <a href="/#contact" className="hidden md:inline-flex btn-primary text-xs py-1.5 px-4 cursor-pointer">
                        Hire me
                    </a>
                    <motion.button
                        className="md:hidden text-text-muted hover:text-primary transition-colors cursor-pointer"
                        onClick={() => setMobileOpen(v => !v)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileOpen
                                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}><X size={18} /></motion.span>
                                : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}><Menu size={18} /></motion.span>
                            }
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-[66px] left-4 right-4 rounded-2xl border border-border-DEFAULT bg-white/97 backdrop-blur-xl p-3 flex flex-col gap-0.5 shadow-card-hover"
                    >
                        {NAV_LINKS.map((l, i) => {
                            const active = isActive(l.href);
                            return (
                                <motion.a
                                    key={l.label}
                                    href={l.href}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.035 }}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-sm font-body font-medium transition-colors py-2.5 px-4 rounded-xl cursor-pointer flex items-center justify-between ${active ? 'bg-cta/8 text-primary' : 'text-text-muted hover:text-primary hover:bg-bg-muted'}`}
                                >
                                    {l.label}
                                    {active && <span className="w-1.5 h-1.5 rounded-full bg-cta" />}
                                </motion.a>
                            );
                        })}
                        <div className="px-4 pt-2 pb-0.5">
                            <a href="/#contact" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center text-xs py-2 cursor-pointer">
                                Hire me
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
