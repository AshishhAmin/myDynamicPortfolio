import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Fast, responsive spring to minimize software lag
    const smoothConfig = { damping: 25, stiffness: 600, mass: 0.05 };
    const cursorX = useSpring(mouseX, smoothConfig);
    const cursorY = useSpring(mouseY, smoothConfig);

    useEffect(() => {
        const onMove = (e) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        const onLeave = () => setIsVisible(false);
        const onOver = (e) => setIsHovering(!!e.target.closest('a, button, input, textarea, [role="button"], .cursor-pointer'));

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        document.body.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            document.body.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    if (!isVisible) return null;

    // Fill colors: Ink-900 for normal, CTA blue for hover
    const fillState = isHovering ? '#2563EB' : '#18181B';
    const scaleState = isHovering ? 1.05 : 1;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
            <motion.div
                className="absolute top-0 left-0"
                style={{ x: cursorX, y: cursorY, originX: 0, originY: 0 }}
                animate={{ scale: scaleState }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                {/* Viewbox shift strategy: -2 -2 offsets the stroke so 0,0 tip remains flawlessly precise */}
                <svg width="28" height="28" viewBox="-2 -2 28 28" fill="none" style={{ position: 'absolute', top: -2, left: -2 }}>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
                    </filter>
                    <motion.polygon 
                        points="0,0 4,18 9,13 16,10" 
                        fill={fillState} 
                        stroke="#FFFFFF" 
                        strokeWidth="1.5" 
                        strokeLinejoin="round" 
                        filter="url(#shadow)" 
                        transition={{ duration: 0.15 }}
                    />
                </svg>
            </motion.div>
        </div>
    );
}
