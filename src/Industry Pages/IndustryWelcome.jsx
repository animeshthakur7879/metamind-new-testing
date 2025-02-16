// IndustryWelcome.jsx
import React, { useState, useEffect } from 'react';
import SubmitProjectFormModal from './SubmitProjectFormModal';
import { useNavigate } from 'react-router-dom';

const IndustryWelcome = () => {
  const [showContent, setShowContent] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [hoverCard, setHoverCard] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const navigate = useNavigate()

  const newFeedbacks = [
    { id: 1, text: "MetaMind's virtual world platform helped us create an immersive training environment for our new employees.", author: "Sarah Chen", company: "Microsoft" },
    { id: 2, text: "As a student, I used MetaMind to build my final year project. The tools are intuitive and powerful!", author: "Alex Rodriguez", university: "Stanford University" },
    { id: 3, text: "We've integrated MetaMind into our architectural visualization process.", author: "David Park", company: "Foster + Partners" },
    { id: 4, text: "The virtual environments created by MetaMind have transformed our remote collaboration!", author: "Emma Thompson", company: "Deloitte Digital" },
    { id: 5, text: "MetaMind made our virtual product launches so much more engaging!", author: "James Wilson", company: "Tesla" }
  ];

  // Stars and Shooting Stars configurations
  const stars = Array.from({ length: 100 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3
  }));

  const shootingStars = Array.from({ length: 5 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    speed: Math.random() * 5 + 3
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setShowContent(true), 1500);

    let currentIndex = 0;
    const interval = setInterval(() => {
      const newFeedback = { ...newFeedbacks[currentIndex], id: Date.now(), isNew: true };
      setFeedbacks(prev => [...prev, newFeedback].slice(-4));
      currentIndex = (currentIndex + 1) % newFeedbacks.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white relative overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 animate-pulse">
        {stars.map((star, index) => (
          <div key={index} className="absolute bg-white rounded-full opacity-20"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {shootingStars.map((star, index) => (
          <div key={index} className="absolute bg-white w-1 h-1 rounded-full animate-shooting"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDuration: `${star.speed}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Logo and Home Button */}
      <div className="absolute top-6 left-6 z-10 flex flex-col space-y-4">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
          MetaMind
        </div>
        <button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          onClick={() => navigate('/industryhome')}
        >
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-12 transition-all duration-1000 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}>
        {/* Welcome Section */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
            Welcome to our Virtual World
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Step into the future of digital interaction where imagination meets reality. 
            Create, collaborate, and experience virtual environments that push the boundaries 
            of what's possible. MetaMind is your gateway to unlimited creative potential.
          </p>
        </div>

        {/* Options Section */}
        <div className="flex flex-col gap-8 max-w-xl mx-auto mb-16">
          {/* Option 1: Submit Project */}
          <div 
            className={`relative bg-black/30 p-8 rounded-lg backdrop-blur-sm transition-all duration-300 cursor-pointer border border-blue-500/30 
              ${hoverCard === 1 ? 'scale-105 border-blue-500 bg-black/40' : 'hover:scale-102'}`}
            onMouseEnter={() => setHoverCard(1)}
            onMouseLeave={() => setHoverCard(null)}
            onClick={() => setShowFormModal(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Share Your Project
            </h2>
            <p className="text-gray-300">
              Let us bring your vision to life. Share your project requirements and our expert team will create a customized virtual world that perfectly matches your needs.
            </p>
            <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105">
              Submit Project
            </button>
          </div>

          {/* Option 2: Create Virtual Room */}
          <div 
            className={`relative bg-black/30 p-8 rounded-lg backdrop-blur-sm transition-all duration-300 cursor-pointer border border-blue-500/30 
              ${hoverCard === 2 ? 'scale-105 border-blue-500 bg-black/40' : 'hover:scale-102'}`}
            onMouseEnter={() => setHoverCard(2)}
            onMouseLeave={() => setHoverCard(null)}
          >
            {/* Added pointer-events-none so this overlay does not block clicks */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Create Your Own Virtual Room
            </h2>
            <p className="text-gray-300">
              Take control of your virtual experience. Use our powerful tools and intuitive interface to build your perfect virtual environment from scratch.
            </p>
            <button 
              onClick={() => navigate('/vroom')}
              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              Start Creating
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="fixed bottom-0 mb-8 right-0 w-96 pointer-events-none">
          {feedbacks.map((feedback, index) => (
            <div 
              key={feedback.id} 
              className="mb-4 mr-4 w-80 bg-black/50 backdrop-blur-sm p-4 rounded-lg transition-all duration-500 ease-in-out transform float-right clear-both hover:bg-black/60"
              style={{ 
                opacity: 1, 
                transform: `translateY(${index === 0 ? '-8px' : '0'})`,
                animation: index === 0 ? 'slideIn 0.5s ease-out' : 'none'
              }}
            >
              <p className="text-sm mb-2">{feedback.text}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {feedback.author}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {feedback.company || feedback.university}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Pulse Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse pointer-events-none" />

      {/* Render the Modal if showFormModal is true */}
      {showFormModal && <SubmitProjectFormModal onClose={() => setShowFormModal(false)} />}
    </div>
  );
};

export default IndustryWelcome;
