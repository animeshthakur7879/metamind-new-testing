// HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
    <section id='HeroSection'
      className="relative h-screen flex flex-col justify-center items-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://informationage-production.s3.amazonaws.com/uploads/2022/10/edtech-trends-for-near-future.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 px-4">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
      Reimagine Education, Redefine Success
</h1>
        <p className="text-xl text-gray-200 mb-8">
        Transform your learning journey with our immersive virtual world that blends real-world projects <br /> with personalized mentorship and AI-driven insights
        </p>
        <div className="flex space-x-4 justify-center">
      {/* Explore Features Button */}
      <a 
        href="#features" 
        className="relative inline-block group py-3 px-6 rounded-full overflow-hidden transition-all duration-300"
      >
        {/* Animated Glowing Gradient Background */}
        <span className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-400 to-green-600 bg-[length:200%_200%] animate-gradient-x rounded-full opacity-75 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"></span>
        {/* Button Text */}
        <span className="relative text-white font-semibold transition-colors duration-300 group-hover:text-gray-100">
          Explore Features
        </span>
      </a>
      
      {/* Get Started Button */}
      <a 
        href="/signup" 
        className="relative inline-block group py-3 px-6 rounded-full overflow-hidden transition-all duration-300"
      >
        {/* Animated Glowing Gradient Background */}
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-[length:200%_200%] animate-gradient-x rounded-full opacity-75 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"></span>
        {/* Button Text */}
        <span className="relative text-white font-semibold transition-colors duration-300 group-hover:text-gray-100">
          Get Started
        </span>
      </a>
    </div>
      </div>
    </section>
  );
};

export default HeroSection;
