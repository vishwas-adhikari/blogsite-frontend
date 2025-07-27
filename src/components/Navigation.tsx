import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-black">
            Vishwas.
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/blogs"
              className="bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Blogs
            </Link>
            <Link
              to="/projects"
              className="bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Projects
            </Link>
            <Link
              to="/about"
              className="bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              About Me
            </Link>
            <Link
              to="/contact"
              className="bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Contact Me
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/blogs"
            onClick={toggleMenu}
            className="block bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Blogs
          </Link>
          <Link
            to="/projects"
            onClick={toggleMenu}
            className="block bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Projects
          </Link>
          <Link
            to="/about"
            onClick={toggleMenu}
            className="block bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            About Me
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="block bg-white text-black px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Contact Me
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
