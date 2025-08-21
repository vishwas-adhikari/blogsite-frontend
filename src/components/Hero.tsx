import React from 'react';
import { Terminal, Shield, Code, ChevronDown } from 'lucide-react';
// --- THIS IS THE NEW IMPORT ---
import { TypeAnimation } from 'react-type-animation';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background and Overlay Elements - No changes needed */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/daoqvaxeq/image/upload/v1753644699/hero-bg_t9qnxl.webp')"
        }}
      >
        <div className="absolute inset-0 bg-[#191a23] bg-opacity-85"></div>
      </div>
      <div className="absolute inset-0 matrix-bg opacity-20"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/20 via-transparent to-blue-400/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Icons - No changes needed */}
        <div className="flex items-center justify-center space-x-6 mb-10">
          <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 glow-green" />
          <Terminal className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 glow-blue" />
          <Code className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 glow-purple" />
        </div>

        {/* --- HEADLINE (NOW WITH TYPING ANIMATION) --- */}
        <TypeAnimation
          sequence={[
            'Welcome to My Digital Playground',
            3000, // Wait 3 seconds after typing
          ]}
          wrapper="h1"
          cursor={true}
          speed={50}
          // The className is copied directly from your original <h1> tag
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
          repeat={Infinity} // Use Infinity to make it repeat, or 0 to type only once
        />

        {/* Subtitle - No changes needed */}
        <div className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 font-medium tracking-wide">
          <span className="text-green-400 glow-green px-2">Cybersecurity</span>
          <span className="text-gray-500"> • </span>
          <span className="text-blue-400 glow-blue px-2">CTFs</span>
          <span className="text-gray-500"> • </span>
          <span className="text-purple-400 glow-purple px-2">Projects</span>
        </div>

        {/* Description - No changes needed */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Join me on my journey through the world of cybersecurity — where curiosity meets code and every challenge is a chance to grow.
        </p>

        {/* CTA Buttons - No changes needed */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => scrollToSection('blogs')}
            className="bg-white text-black px-8 py-3 sm:px-10 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-xl hover:scale-105 transition-all duration-300"
          >
            Explore Blogs
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="bg-transparent border-2 border-white text-white px-8 py-3 sm:px-10 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-xl hover:scale-105 transition-all duration-300"
          >
            View Projects
          </button>
        </div>

        {/* Scroll Indicator - No changes needed */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;