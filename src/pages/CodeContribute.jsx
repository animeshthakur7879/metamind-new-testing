import React, { useState } from "react";
import { ArrowLeft, Bell, Menu, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CodeContributePage = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate()

  const features = [
    {
      id: "open-source-projects",
      title: "Open Source Projects",
      color: "blue",
      description:
        "Contribute to real-world projects, collaborate with experts, and enhance your coding skills.",
        path : "/opensource"
    },
    {
      id: "live-coding-challenges",
      title: "Live Coding Challenges",
      color: "purple",
      description:
        "Test your skills in real-time challenges and coding competitions.",
        path : "/codingchallenges"
    },
    {
      id: "collaboration-reviews",
      title: "Collaboration & Reviews",
      color: "green",
      description:
        "Work together with peers and get feedback on your code.",
    },
    {
      id: "integrated-code-editor",
      title: "Integrated Code Editor",
      color: "yellow",
      description:
        "Write, run, and debug your code directly in your browser.",
    },
    {
      id: "community-discussions",
      title: "Community Discussions",
      color: "indigo",
      description:
        "Engage in vibrant discussions and share knowledge with the community.",
    },
    {
      id: "leaderboard",
      title: "Leaderboard",
      color: "red",
      description: "Compete with others and climb the ranks.",
    },
  ];

  const handleClick = (feature) => {
    navigate(feature.path)
  }

  // Mapping for color classes
  const colorClasses = {
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600" },
    purple: { bg: "bg-purple-500", hover: "hover:bg-purple-600" },
    green: { bg: "bg-green-500", hover: "hover:bg-green-600" },
    yellow: { bg: "bg-yellow-500", hover: "hover:bg-yellow-600" },
    indigo: { bg: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    red: { bg: "bg-red-500", hover: "hover:bg-red-600" },
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white">MetaMind</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white">
                Home
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Courses
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Community
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Resources
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-white hover:bg-white/10 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full text-white hover:bg-white/10"
                >
                  <User size={20} />
                </button>
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
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="text-center my-12">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Code & Contribute
          </motion.h1>
          <p className="text-lg text-gray-600 mt-4">
            Explore, contribute, and collaborate on open-source projects to boost
            your skills.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              onClick={(e)=> handleClick(feature)}
              key={feature.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden"
            >
              <h2 className={`text-2xl font-bold text-${feature.color}-500`}>
                {feature.title}
              </h2>
              <p className="text-gray-600 mt-2">{feature.description}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`mt-4 ${colorClasses[feature.color].bg} ${colorClasses[feature.color].hover} py-2 px-4 rounded-full text-white transition-colors shadow-md`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeContributePage;
