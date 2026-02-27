import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsShowcase from './components/ProjectsShowcase';
import SkillsSection from './components/SkillsSection';
import Footer from './components/Footer';
import Experience from './pages/Experience';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import BlogSection from './components/BlogSection';
import GithubPulse from './components/GithubPulse';
import CustomCursor from './components/CustomCursor';
import './index.css';

const LandingPage = ({ isAdmin, setIsAdmin }) => (
    <main className="relative h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <div className="snap-start"><HeroSection /></div>
        <div className="snap-start"><ProjectsShowcase /></div>
        <div className="snap-start"><Experience /></div>
        <div className="snap-start"><GithubPulse /></div>
        <div className="snap-start"><SkillsSection /></div>
        <div className="snap-start"><BlogSection /></div>
        <div className="snap-start"><Footer /></div>
    </main>
);

const ExperiencePage = ({ isAdmin, setIsAdmin }) => (
    <main className="relative h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <div className="snap-start"><Experience /></div>
        <div className="snap-start"><Footer /></div>
    </main>
);

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

const AnimatedRoutes = ({ isAdmin, setIsAdmin }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><LandingPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} /></PageTransition>} />
                <Route path="/experience" element={<PageTransition><ExperiencePage isAdmin={isAdmin} setIsAdmin={setIsAdmin} /></PageTransition>} />
                <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
                <Route path="/blog" element={<PageTransition><BlogList /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <BrowserRouter>
            <CustomCursor />
            <div className="relative min-h-screen">
                <AnimatedBackground />
                <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
                <AnimatedRoutes isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            </div>
        </BrowserRouter>
    );
}

export default App;
