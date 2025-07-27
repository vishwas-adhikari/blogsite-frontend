import React from 'react';
import { Mail, Github, Linkedin, Terminal, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1015] border-t border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left - Branding */}
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Vishwas S Adhikari</h3>
              <p className="text-gray-400 text-xs">Security Researcher</p>
            </div>
          </div>

          {/* Center - Contact */}
          <div className="text-center">
            <p className="text-gray-400 mb-3 text-sm">Ready to collaborate?</p>
            <a
              href="https://www.linkedin.com/in/vishwasadhikari/"
              className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm inline-flex items-center space-x-2 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Right - Social Links */}
          <div className="flex justify-center md:justify-end space-x-3">
            <a
              href="https://github.com/vishwas-adhikari"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/vishwasadhikari/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/vishwasadhikari/"
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <hr className="border-gray-800 my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-gray-400 text-xs">
          <div className="flex items-center space-x-1">
            <span>&copy; 2025 Vishwas. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-400 mx-1" />
            <span>and lots of coffee</span>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
            <a
              href="https://www.linkedin.com/in/vishwasadhikari/"
              className="hover:text-white transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
