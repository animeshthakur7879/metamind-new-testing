// src/components/Index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Menu } from 'react-feather';

const Index = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white">MetaMind</h1>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Home
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Courses
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Community
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Resources
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-full text-white hover:bg-white/10 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <User size={20} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Help Center
                    </a>
                    <hr className="my-1" />
                    <a
                      href="#"
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom fadeIn animation for Tailwind */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>

      {/* Main Content */}
      {/* Added top padding (pt-20) to ensure content isn't hidden behind the fixed navbar */}
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Assessment Hub
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Unlock your potential with our comprehensive assessments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/test')}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg hover:opacity-90 transition transform hover:scale-105 focus:outline-none"
            >
              Start a New Test
            </button>
            <button
              onClick={() => navigate('/results')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:opacity-90 transition transform hover:scale-105 focus:outline-none"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
