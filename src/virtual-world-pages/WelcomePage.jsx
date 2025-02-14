import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Enhanced cloud animation with particles
const CloudAnimation = () => (
  <div className="fixed inset-0 pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-cloud opacity-0"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.3}s`
        }}
      >
        <div className="w-24 h-24 bg-white rounded-full blur-xl" />
      </div>
    ))}
    {/* Adding floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={`particle-${i}`}
        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float opacity-50"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }}
      />
    ))}
  </div>
);

const WelcomePage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const options = [
    {
      icon: "🌍",
      text: "Explore Real-World Projects",
      route: '/virtualcompanyprojects'
    },
    {
      icon: "💻",
      text: "Your Current Virtual Projects",
      route: '/virtualdashboard'
    },
    {
      icon: "🏠",
      text: "Create Your Own Virtual Room",
      route: '/virtualroom'
    },
    {
      icon: "📝",
      text: "Interview Preparation Questions",
      route: '/interviewprep'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex flex-col items-center p-8 overflow-hidden">
      <CloudAnimation />

      {/* Enhanced Exit Button */}
      <button 
        onClick={() => navigate('/buildingpage')}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-x-2 shadow-lg hover:shadow-red-500/50 animate-fadeInDown group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Exit Virtual World</span>
      </button>

      {showContent && (
        <>
          {/* Enhanced Header with Sparkles */}
          <div className="text-center mb-12 animate-fadeInDown relative">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 relative">
              Welcome to Metamind's Virtual World
              <Sparkles className="absolute -top-8 -right-8 w-6 h-6 text-yellow-400 animate-sparkle" />
              <Stars className="absolute -bottom-8 -left-8 w-6 h-6 text-purple-400 animate-sparkle-delayed" />
            </h1>
          </div>

          {/* Enhanced Options Grid */}
          <div className="grid gap-8 w-full max-w-3xl">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => option.route && navigate(option.route)}
                className="group bg-black/50 backdrop-blur-sm rounded-xl p-6 flex items-center cursor-pointer transform transition-all duration-500 hover:scale-105 hover:bg-blue-900/50 border border-blue-500/30 hover:border-blue-400 shadow-lg hover:shadow-blue-500/20 animate-slideInRight relative overflow-hidden"
                style={{
                  animationDelay: `${index * 200 + 500}ms`
                }}
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                
                {/* Icon with enhanced animation */}
                <div className="w-16 h-16 bg-black/60 group-hover:bg-black/40 rounded-full flex items-center justify-center text-4xl mr-6 transition-all duration-300 transform group-hover:rotate-12 relative">
                  <span className="transform transition-transform group-hover:scale-110">
                    {option.icon}
                  </span>
                </div>

                {/* Enhanced Text */}
                <span className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                  {option.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes cloud {
          0% {
            opacity: 0;
            transform: translateX(-100%) scale(0.5);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(1.5);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-cloud {
          animation: cloud 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-sparkle-delayed {
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }

        .animate-fadeInDown {
          animation: fadeInDown 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;