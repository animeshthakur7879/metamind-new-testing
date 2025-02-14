// BenefitsSection.jsx
import React from "react";
import {
  FaUserGraduate,
  FaIndustry,
  FaChartLine,
  FaRocket,
  FaHandsHelping,
  FaHandshake,
} from "react-icons/fa";

const benefits = [
  {
    title: "Real-World Portfolio",
    description:
      "Build a portfolio with hands-on projects and real-world tasks that make your resume stand out even before graduation.",
    icon: <FaUserGraduate className="text-blue-400 text-5xl" />,
  },
  {
    title: "Industry-Ready Experience",
    description:
      "Gain practical experience through simulated projects, ensuring you're prepared for the demands of a modern workplace.",
    icon: <FaIndustry className="text-blue-400 text-5xl" />,
  },
  {
    title: "Cost-Efficient Hiring",
    description:
      "Help companies reduce training costs by providing pre-trained, job-ready talent with a verified portfolio.",
    icon: <FaChartLine className="text-blue-400 text-5xl" />,
  },
  {
    title: "Accelerated Career Growth",
    description:
      "Access personalized learning and mentorship that rapidly upgrades your skills and fast-tracks your career advancement.",
    icon: <FaRocket className="text-blue-400 text-5xl" />,
  },
  {
    title: "Enhanced Soft Skills",
    description:
      "Develop essential soft skills like teamwork, communication, and problem-solving through collaborative virtual projects.",
    icon: <FaHandsHelping className="text-blue-400 text-5xl" />,
  },
  {
    title: "Bridging Academia & Industry",
    description:
      "Experience the fusion of theoretical knowledge and practical application, ensuring a seamless transition into the professional world.",
    icon: <FaHandshake className="text-blue-400 text-5xl" />,
  },
];

const BenefitsSection = () => {
  return (
    <section id='BenifitsSection' className="w-full py-16 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Why Choose MetaMind's Virtual World?
        </h2>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Our platform delivers unparalleled benefits that empower students,
          reduce training costs for companies, and bridge the gap between
          academic learning and industry demands.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 duration-300">
          {benefits.map((benefit, index) => (
            <div data-aos="flip-left"
              key={index}
              className="flex items-start bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="mr-4">{benefit.icon}</div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-blue-400">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 mt-2">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
