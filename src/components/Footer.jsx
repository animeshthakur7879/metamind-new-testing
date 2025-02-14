// Footer.jsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id='Footer' className="bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Grid Layout for Contact, Quick Links, Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-bold text-blue-400 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>123, XYZ Street, City, Country</li>
              <li>Email: info@skillconnecthub.com</li>
              <li>Phone: +91 98765 43210</li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-blue-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-blue-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-300 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/courses" className="hover:text-blue-300 transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-300 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-300 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media Icons */}
          <div>
            <h4 className="text-xl font-bold text-blue-400 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-400 rounded-full hover:bg-blue-300 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-pink-600 rounded-full hover:bg-pink-500 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-700 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="my-8 border-gray-700" />
        
        {/* Bottom Section: Copyright & Attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>&copy; 2025 MetaMind. All rights reserved.</p>
          <p>Designed with ❤️ by SyntaxSquad Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
