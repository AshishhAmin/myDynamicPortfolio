import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const placeholderProjects = [
    {
        id: 1,
        title: "Cashflow App",
        description: "Personal finance tracker with real-time analytics and predictive insights.",
        tech_stack: ["React", "Node.js", "MongoDB", "Tailwind"],
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        title: "Digital Census Portal",
        description: "High-scale data collection architecture for national surveys.",
        tech_stack: ["Next.js", "PostgreSQL", "Prisma"],
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        title: "AGRITECH System",
        description: "IoT dashboard for monitoring soil moisture and automated irrigation.",
        tech_stack: ["Vue", "Express", "MQTT"],
        image_url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 4,
        title: "Neon Cyber Store",
        description: "E-commerce platform with 3D product visualization.",
        tech_stack: ["React Three Fiber", "Stripe", "Supabase"],
        image_url: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80",
    }
];

const BentoProjectsGrid = () => {
    const [projects, setProjects] = useState(placeholderProjects);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/projects`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setProjects(data);
            })
            .catch(err => console.error('Could not fetch projects:', err));
    }, []);

    const cardVariants = {
        offscreen: { y: 100, opacity: 0 },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", bounce: 0.4, duration: 0.8 }
        }
    };

    return (
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto" id="projects">
            <div className="mb-16">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                    Featured <span className="text-transparent WebkitTextStroke stroke-cyber-neon stroke-2">Work</span>
                </h2>
                <div className="w-24 h-2 bg-cyber-pink"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id || index}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={cardVariants}
                        onClick={() => project.id && navigate(`/project/${project.id}`)}
                        className={`group relative overflow-hidden rounded-3xl glass-panel border-2 border-transparent hover:border-cyber-neon transition-all duration-300 cursor-pointer ${project.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                            project.size === 'wide' ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-1'
                            }`}
                    >
                        {/* Project Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/50 to-transparent"></div>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide group-hover:text-cyber-neon transition-colors">
                                    {project.title}
                                </h3>
                                <motion.div
                                    whileHover={{ rotate: 45, scale: 1.2 }}
                                    className="w-12 h-12 rounded-full bg-white text-cyber-black flex items-center justify-center -translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                >
                                    <ArrowUpRight strokeWidth={3} />
                                </motion.div>
                            </div>

                            <p className="text-gray-300 font-mono text-sm mb-6 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map((tech, i) => (
                                    <span key={i} className="px-3 py-1 text-xs font-mono uppercase bg-cyber-black/50 border border-cyber-pink/50 rounded-full text-cyber-pink pb-1">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default BentoProjectsGrid;
