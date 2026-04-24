import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FadeUp } from './MotionPrimitives';

const tagPalette = [
    'bg-white/[0.07] text-ink-100 border-white/[0.10]',
    'bg-white/[0.05] text-ink-200 border-white/[0.08]',
    'bg-white/[0.08] text-ink-50  border-white/[0.12]',
    'bg-white/[0.06] text-ink-100 border-white/[0.09]',
];

const ProjectCard = ({ project, index }) => (
    <FadeUp delay={index * 0.1}>
        <motion.article
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="glass-card overflow-hidden flex flex-col h-full group cursor-pointer
                 hover:border-white/20 hover:shadow-glow-sm transition-all duration-300"
        >
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl m-3 mb-0 h-44 md:h-52">
                <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />

                {/* Arrow badge */}
                <motion.div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.15 }}
                >
                    <ArrowUpRight size={16} className="text-ink-900" />
                </motion.div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-base font-bold text-white group-hover:text-shimmer transition-colors mb-1.5">
                    {project.title}
                </h3>
                <div className="flex-1 mb-4"></div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.map((tech, i) => (
                        <span
                            key={i}
                            className={`pill border text-[11px] ${tagPalette[(index + i) % tagPalette.length]}`}
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {project.live_link && (
                    <a
                        href={project.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 text-xs font-semibold text-ink-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                    >
                        View Live <ArrowUpRight size={12} />
                    </a>
                )}
            </div>
        </motion.article>
    </FadeUp>
);

export default ProjectCard;
