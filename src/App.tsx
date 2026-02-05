import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import ProjectSection from './components/ProjectSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import AllBlogsPage from './components/AllBlogsPage';
import AllProjectsPage from './components/AllProjectsPage';
import AdminPortal from './components/AdminPortal'; // Import the portal

// --- ADD THESE THREE NEW IMPORTS ---
import CtfSection from './components/CtfSection';
import AllCtfsPage from './components/AllCtfsPage';
import CtfDetailPage from './components/CtfDetailPage';

// A simple component for the homepage layout
// --- ADD THE NEW <CtfSection /> TO THE HOMEPAGE LAYOUT ---
const HomePage = () => (
  <>
    <Hero />
    <BlogSection />
    <ProjectSection />
    <CtfSection /> 
    <AboutSection />
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-[#191a23] text-white overflow-x-hidden">
      <Navigation />
      <main>
        <Routes>
          {/* Your existing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/blogs" element={<AllBlogsPage />} />
          <Route path="/projects" element={<AllProjectsPage />} />

          {/* --- ADD THESE TWO NEW ROUTES FOR THE CTF FEATURE --- */}
          <Route path="/ctfs" element={<AllCtfsPage />} />
          <Route path="/ctf/:slug" element={<CtfDetailPage />} />

        
          <Route path="/admin-gate-secure-123" element={<AdminPortal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;