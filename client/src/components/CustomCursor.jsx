import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Use motion values for raw coordinates to avoid React re-renders on every pixel move
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Apply spring physics for smooth trailing effect
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const solidX = useSpring(mouseX, { ...springConfig, mass: 0.1 }); // Fast inner dot
    const solidY = useSpring(mouseY, { ...springConfig, mass: 0.1 });
    const outlineX = useSpring(mouseX, springConfig); // Slower outer ring
    const outlineY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isVisible) setIsVisible(true);
            // Center the cursor elements on the mouse coordinate
            mouseX.set(e.clientX - 16); // 16 is half the outer ring width
            mouseY.set(e.clientY - 16);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        // const handleMouseEnter = () => setIsVisible(true); // Removed as per instruction

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        // document.body.addEventListener('mouseenter', handleMouseEnter); // Removed as per instruction
        const handleInteractionStart = () => setIsHovering(true);
        const handleInteractionEnd = () => setIsHovering(false);

        const interactionObserver = (e) => {
            const isInteractive = e.target.closest('a, button, input, textarea, [role="button"], .cursor-pointer');
            if (isInteractive) setIsHovering(true);
            else setIsHovering(false);
        };

        window.addEventListener('mouseover', interactionObserver);

        // Detect hover on interactive elements
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            // document.body.removeEventListener('mouseenter', handleMouseEnter); // Removed as per instruction
            window.removeEventListener('mouseover', interactionObserver);
        };
    }, []);

    if (!isVisible) return null;

    // Outer ring variants
    const variants = {
        default: {
            scale: 1,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.4)',
        },
        hover: {
            scale: 1.5,
            backgroundColor: 'rgba(57, 255, 20, 0.1)', // Cyber neon tint
            border: '1px solid rgba(57, 255, 20, 0.8)',
        },
        click: {
            scale: 0.8,
            backgroundColor: 'transparent',
            border: '2px solid rgba(255, 255, 255, 1)',
        }
    };

    // Inner dot variants
    const dotVariants = {
        default: { opacity: 1 },
        hover: { opacity: 0 }, // Hide dot when hovering
        click: { opacity: 1, scale: 0.5 }
    };

    const currentState = isClicking ? 'click' : (isHovering ? 'hover' : 'default');

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
            {/* Outer Ring */}
            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center mix-blend-difference"
                style={{ x: outlineX, y: outlineY }}
                variants={variants}
                animate={currentState}
                transition={{ duration: 0.2 }}
            >
                {/* Inner Dot */}
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full relative"
                    variants={dotVariants}
                    animate={currentState}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            {/* Fast Inner Dot (Tracks exact mouse center perfectly) */}
            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ x: solidX, y: solidY }}
            >
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    variants={dotVariants}
                    animate={currentState}
                    transition={{ duration: 0.1 }}
                />
            </motion.div>
        </div>
    );
}
