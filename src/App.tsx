import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BlogSection from './components/BlogSection';
import ProjectSection from './components/ProjectSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';

// A simple component for the homepage layout
const HomePage = () => (
  <>
    <Hero />
    <BlogSection />
    <ProjectSection />
    <AboutSection />
  </>
);

function App() {
  return (
    // We REMOVED the <Router> from here. This is just a div now.
    <div className="min-h-screen bg-[#191a23] text-white overflow-x-hidden">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* THE CRITICAL FIX: The path now correctly uses ':slug' */}
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;