import React from 'react';
import { motion } from 'framer-motion';

const SkillsMarquee = () => {
    const techStack = [
        "REACT", "TAILWIND CSS", "NODE.JS", "EXPRESS", "NEON DB", "POSTGRESQL", "CLOUDINARY", "FRAMER MOTION", "VITE",
        // Duplicate for seamless loop
        "REACT", "TAILWIND CSS", "NODE.JS", "EXPRESS", "NEON DB", "POSTGRESQL", "CLOUDINARY", "FRAMER MOTION", "VITE",
    ];

    return (
        <div className="w-full bg-cyber-neon py-4 border-y-4 border-cyber-black overflow-hidden relative rotate-[-2deg] my-20 scale-110">

            {/* Container for scrolling content */}
            <div className="flex w-[200%] animate-marquee">
                <div className="flex w-1/2 justify-around items-center">
                    {techStack.map((tech, index) => (
                        <div key={index} className="flex items-center gap-4 mx-8">
                            <span className="text-2xl md:text-4xl font-black text-cyber-black tracking-widest uppercase">
                                {tech}
                            </span>
                            <span className="text-2xl text-cyber-pink font-mono">✦</span>
                        </div>
                    ))}
                </div>
                <div className="flex w-1/2 justify-around items-center">
                    {techStack.map((tech, index) => (
                        <div key={`dup-${index}`} className="flex items-center gap-4 mx-8">
                            <span className="text-2xl md:text-4xl font-black text-cyber-black tracking-widest uppercase">
                                {tech}
                            </span>
                            <span className="text-2xl text-cyber-pink font-mono">✦</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SkillsMarquee;
