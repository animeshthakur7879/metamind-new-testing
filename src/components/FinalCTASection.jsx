import React from 'react';

const FinalCTASection = () => {
  return (
    <section id='FinalCTASection' className="w-full py-16 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 text-white ">
      {/* Background Image with Subtle Opacity */}
      <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?futuristic,technology')] bg-cover bg-center opacity-30"></div>
      {/* Dark Overlay for Contrast */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Animated Gradient Headline */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse drop-shadow-xl">
          Ready to Bridge Your Skills Gap?
        </h2>
        
        {/* Supporting Subheadlines */}
        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
          Join SkillConnect Virtual World and become industry-ready!
          Gain hands-on experience through real projects, personalized learning paths,
          and direct mentorship from industry experts.
        </p>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Don’t let the skills gap hold you back.
          Step into a world where every project is a stepping stone to success and every challenge transforms into an opportunity.
          The future of learning is here – and it’s waiting for you.
        </p>
        
        {/* CTA Button */}
        <div className="mt-12">
          <a 
            href="/join"
            className="relative inline-block px-10 py-4 font-bold text-white uppercase tracking-wider rounded-full overflow-hidden group transition-transform duration-500 transform hover:scale-110"
          >
            {/* Animated Gradient Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_200%] rounded-full animate-[gradientShift_4s_linear_infinite] transition-transform duration-500"></span>
            {/* Semi-transparent Overlay */}
            <span className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition duration-500"></span>
            {/* Button Text */}
            <span className="relative z-10">Join Now</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
