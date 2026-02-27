import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ isAdmin, setIsAdmin }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { label: 'About', href: '/#about', isExternal: false },
        { label: 'Works', href: '/#projects', isExternal: false },
        { label: 'Journey', href: '/#experience', isExternal: false },
        { label: 'Skills', href: '/#skills', isExternal: false },
        { label: 'Blog', href: '/#blog', isExternal: false },
        { label: 'Contact', href: '/#contact', isExternal: false },
    ];

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, delay: 0.15 }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center px-6 pt-4"
        >
            {/* Pill nav bar */}
            <nav className="w-full max-w-3xl flex items-center justify-between gap-4 px-6 py-3 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-sm font-semibold text-white tracking-widest uppercase shrink-0"
                >
                    <span className="text-zinc-600">portfolio</span>
                </Link>

                {/* Desktop links — centred */}
                <ul className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
                    {links.map(l => (
                        <li key={l.label}>
                            {l.isExternal ? (
                                <Link
                                    to={l.href}
                                    className="text-xs font-medium text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide"
                                >
                                    {l.label}
                                </Link>
                            ) : (
                                <a
                                    href={l.href}
                                    className="text-xs font-medium text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide"
                                >
                                    {l.label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>


                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-zinc-400 hover:text-white transition-colors ml-auto"
                    onClick={() => setMobileOpen(v => !v)}
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-20 left-4 right-4 rounded-2xl border border-white/[0.08] bg-black/80 backdrop-blur-xl p-5 flex flex-col gap-4"
                    >
                        {links.map(l => (
                            l.isExternal ? (
                                <Link
                                    key={l.label}
                                    to={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors py-1 border-b border-white/[0.05] last:border-0"
                                >
                                    {l.label}
                                </Link>
                            ) : (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors py-1 border-b border-white/[0.05] last:border-0"
                                >
                                    {l.label}
                                </a>
                            )
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
