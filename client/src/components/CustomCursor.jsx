import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — light theme version
 * Outer ring: soft indigo (matches CTA blue)
 * Inner dot: near-black (ink)
 */
export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const spring = { damping: 25, stiffness: 300, mass: 0.5 };
    const solidX = useSpring(mouseX, { ...spring, mass: 0.1 });
    const solidY = useSpring(mouseY, { ...spring, mass: 0.1 });
    const outlineX = useSpring(mouseX, spring);
    const outlineY = useSpring(mouseY, spring);

    useEffect(() => {
        const onMove = (e) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };
        const onDown = () => setIsClicking(true);
        const onUp = () => setIsClicking(false);
        const onLeave = () => setIsVisible(false);
        const onOver = (e) => setIsHovering(!!e.target.closest('a, button, input, textarea, [role="button"], .cursor-pointer'));

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('mouseover', onOver);
        document.body.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('mouseover', onOver);
            document.body.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    if (!isVisible) return null;

    const state = isClicking ? 'click' : isHovering ? 'hover' : 'default';

    const ringV = {
        default: { scale: 1, backgroundColor: 'transparent', border: '1.5px solid rgba(37,99,235,0.35)' },
        hover: { scale: 1.6, backgroundColor: 'rgba(37,99,235,0.08)', border: '1.5px solid rgba(37,99,235,0.65)' },
        click: { scale: 0.8, backgroundColor: 'rgba(37,99,235,0.05)', border: '2px solid rgba(9,9,11,0.7)' },
    };

    const dotV = {
        default: { opacity: 1, backgroundColor: '#18181B' },
        hover: { opacity: 0 },
        click: { opacity: 1, scale: 0.5, backgroundColor: '#2563EB' },
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ x: outlineX, y: outlineY }}
                variants={ringV}
                animate={state}
                transition={{ duration: 0.18 }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    variants={dotV}
                    animate={state}
                    transition={{ duration: 0.18 }}
                />
            </motion.div>

            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ x: solidX, y: solidY }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    variants={{ default: { opacity: 1 }, hover: { opacity: 0 }, click: { opacity: 1 } }}
                    animate={state}
                    transition={{ duration: 0.1 }}
                />
            </motion.div>
        </div>
    );
}
