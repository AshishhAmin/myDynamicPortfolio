import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable fade-up reveal for scroll-triggered sections.
 * Wrap any element with this for a gentle float-up entrance.
 */
export const FadeUp = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        className={className}
    >
        {children}
    </motion.div>
);

/**
 * StaggerParent / StaggerChild — for staggered list or word reveals.
 */
export const StaggerParent = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
        }}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerChild = ({ children, className = '' }) => (
    <motion.span
        variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
            visible: {
                opacity: 1, y: 0, filter: 'blur(0px)',
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            },
        }}
        className={`inline-block ${className}`}
    >
        {children}
    </motion.span>
);
