import React from 'react';
import { motion } from 'framer-motion';

/**
 * FadeUp — gentle scroll-triggered float-up entrance.
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
 * SlideIn — slides in from left or right on scroll.
 */
export const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => {
    const x = direction === 'left' ? -32 : 32;
    return (
        <motion.div
            initial={{ opacity: 0, x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/**
 * ScaleIn — scales up from slightly smaller on scroll.
 */
export const ScaleIn = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
        className={className}
    >
        {children}
    </motion.div>
);

/**
 * StaggerParent / StaggerChild — staggered list or word reveals.
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

/**
 * HoverCard — subtle scale + shadow on hover for interactive cards.
 */
export const HoverCard = ({ children, className = '' }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.015 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);
