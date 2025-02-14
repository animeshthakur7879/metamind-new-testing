import React from "react";
import { FaBrain, FaBuilding, FaGamepad, FaChalkboardTeacher } from "react-icons/fa";

const features = [
  {
    title: "AI-Driven Learning",
    description: "Personalized courses tailored to your skills and career goals.",
    icon: <FaBrain className="text-blue-400 text-5xl" />,
  },
  {
    title: "Virtual Companies & Projects",
    description: "Work on real-world tasks in simulated virtual industry environments.",
    icon: <FaBuilding className="text-blue-400 text-5xl" />,
  },
  {
    title: "Gamified Progress & Virtual Visa",
    description: "Earn badges, unlock opportunities, and level up your industry skills.",
    icon: <FaGamepad className="text-blue-400 text-5xl" />,
  },
  {
    title: "Industry Mentorship",
    description: "Learn directly from experienced industry experts and mentors.",
    icon: <FaChalkboardTeacher className="text-blue-400 text-5xl" />,
  },
];

const KeyFeatures = () => {
  return (
    <section id="KeyFeatures" className="text-white py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Key Features
        </h2>
        <p className="text-gray-400 mt-3">
          Explore our platform’s unique features designed to bridge the gap between academia and industry.
        </p>

        {/* Features Grid */}
        <div data-aos="zoom-in-up" className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 data-aos=flip-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 
              transform transition-all duration-300 hover:scale-105 hover:border-blue-500"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 p-3 rounded-full shadow-md border border-gray-700">
                {feature.icon}
              </div>
              <h3 className="mt-10 text-xl font-semibold text-blue-400">{feature.title}</h3>
              <p className="text-gray-300 mt-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
