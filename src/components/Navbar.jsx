// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Ensure you have a Router wrapper

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo with gradient text */}
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          <Link to="/">MetaMind </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-300 hover:text-blue-400 transition duration-300">
            Home
          </a>
          <a href="#about" className="text-gray-300 hover:text-blue-400 transition duration-300">
            About
          </a>
          <a href="#KeyFeatures" className="text-gray-300 hover:text-blue-400 transition duration-300">
            Features
          </a>
          <a href="#BenifitsSection" className="text-gray-300 hover:text-blue-400 transition duration-300">
            Why Us?
          </a>
          <a href="#TestimonialsCarousel" className="text-gray-300 hover:text-blue-400 transition duration-300">
            Testimonials
          </a>
          <a href="#Footer" className="text-gray-300 hover:text-blue-400 transition duration-300">
            Contact
          </a>
        </nav>

        {/* Enhanced CTA Button for Desktop */}
        <div className="hidden md:block">
          <Link 
            to="/SignUp"
            className="relative inline-block px-6 py-3 font-semibold text-white group"
          >
            {/* Animated glowing background */}
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-0 -translate-y-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 rounded-full blur opacity-75 group-hover:opacity-100"></span>
            {/* Button Text */}
            <span className="relative transition-transform duration-300 transform group-hover:scale-110">
              Join Now
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
          <div className="px-6 py-4 flex flex-col space-y-4">
            <Link onClick={() => setIsOpen(false)} to="/" className="text-gray-300 hover:text-blue-400 transition duration-300">
              Home
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/about" className="text-gray-300 hover:text-blue-400 transition duration-300">
              About
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/features" className="text-gray-300 hover:text-blue-400 transition duration-300">
              Features
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/courses" className="text-gray-300 hover:text-blue-400 transition duration-300">
              Courses
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/testimonials" className="text-gray-300 hover:text-blue-400 transition duration-300">
              Testimonials
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/contact" className="text-gray-300 hover:text-blue-400 transition duration-300">
              Contact
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              to="/join"
              className="relative inline-block px-6 py-3 font-semibold text-white group text-center transition duration-300"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-0 -translate-y-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 rounded-full blur opacity-75 group-hover:opacity-100"></span>
              <span className="relative transition-transform duration-300 transform group-hover:scale-110">
                Join Now
              </span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
