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
    <>
        <AnimatedBackground />
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="relative h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
            <div className="snap-start"><HeroSection /></div>
            <div className="snap-start"><ProjectsShowcase /></div>
            <div className="snap-start"><Experience /></div>
            <div className="snap-start"><GithubPulse /></div>
            <div className="snap-start"><SkillsSection /></div>
            <div className="snap-start"><BlogSection /></div>
            <div className="snap-start"><Footer /></div>
        </main>
    </>
);

const ExperiencePage = ({ isAdmin, setIsAdmin }) => (
    <>
        <AnimatedBackground />
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="relative h-[100dvh] overflow-y-auto snap-y snap-mandatory scroll-smooth">
            <div className="snap-start"><Experience /></div>
            <div className="snap-start"><Footer /></div>
        </main>
    </>
);

const AnimatedRoutes = ({ isAdmin, setIsAdmin }) => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
            <Route path="/experience" element={<ExperiencePage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
};

function App() {
    console.log('[DEBUG] App component rendering');
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <BrowserRouter>
            <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'red', color: 'white', fontSize: '10px', padding: '2px' }}>
                [DIAGNOSTIC MODE ACTIVE]
            </div>
            {/* <CustomCursor /> */}
            <AnimatedRoutes isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        </BrowserRouter>
    );
}

export default App;
