import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link for the logo
import { Menu, X, Terminal } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // This logic is good, no changes needed here.
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-[#191a23]/95 backdrop-blur-lg shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Changed to a <Link> for better accessibility */}
          <Link 
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
          >
            <Terminal className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-white tracking-tight">Vishwas S Adhikari</span>
          </Link>

          {/* --- DESKTOP NAVIGATION (WITH SIZE INCREASE) --- */}
          <div className="hidden md:flex items-center space-x-1">
            {['Home', 'Blogs', 'Projects', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                // THE CHANGES ARE HERE:
                // - Font size increased from 'text-xs' to 'text-sm'
                // - Padding (px- and py-) increased slightly for a larger button area
                className="bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-white text-black p-2 rounded-full shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu - no size changes needed here as it's already a good size */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-[#191a23]/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-800">
            <div className="flex flex-col space-y-2">
              {['Home', 'Blogs', 'Projects', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm text-center hover:scale-105 transition-all duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;