import React, { useState } from "react";
import { Search, ArrowRight, ArrowLeft, Bell, User, Menu } from "lucide-react";

const CaseStudyCard = ({ title, description, imageUrl }) => {
  return (
    <div className="p-5 shadow-xl bg-white hover:shadow-2xl transition duration-300 rounded-lg">
      <div className="h-48 rounded-lg mb-4 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">Image</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-xl text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        <button className="w-full mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-[#0AA5B1] transition-colors duration-300 flex items-center justify-center gap-2 group">
          Learn More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const CaseStudy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const caseStudies = [
    {
      title: "Google Case Study",
      description: "A deep dive into Google's innovative strategies that revolutionized the digital world.",
      imageUrl: "https://media.wired.com/photos/65e83cc9b8ffa5f8fa84c893/4:3/w_2664,h_1998,c_limit/wired-uk-google-watching.jpg"
    },
    {
      title: "Tesla Case Study",
      description: "Understanding Tesla's disruptive approach in the automotive and energy sectors.",
      imageUrl: "https://www.logoai.com/uploads/articles/2024/03/05/tesla-logo-white-1709619543.jpg"
    },
    {
      title: "Amazon Case Study",
      description: "How Amazon mastered e-commerce logistics and customer-centric business models.",
      imageUrl: "https://outvio.com/static/43dda54a37da393abbf0fccc92840e86/e30c4/ckyycvha3000c7b9gfipieqcb.jpg"
    },
    {
      title: "Microsoft Case Study",
      description: "Exploring Microsoft's dominance in software and cloud computing innovations.",
      imageUrl: "https://theincmagazine.com/wp-content/uploads/2022/01/Microsoft-story.jpg"
    },
    {
      title: "Apple Case Study",
      description: "Unveiling Apple's design, marketing, and ecosystem strategies for success.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzac8b2HE_gybK-u6G3OpFYrEbZvxT6biqSA&s"
    },
    {
      title: "Netflix Case Study",
      description: "How Netflix disrupted the entertainment industry with its streaming model.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCxupEPdf79YoiQE9FS_hy9_C164UZ8uk-KQ&s"
    }
  ];

  const filteredCaseStudies = caseStudies.filter(
    study => study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             study.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navigation Bar */}
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
              <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Courses</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Community</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Resources</a>
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
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Help Center</a>
                    <hr className="my-1" />
                    <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Sign Out</a>
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

      {/* Main Content */}
      <div className="pt-20 w-full flex justify-center items-center p-6">
        <div className="w-11/12 max-w-7xl p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-center shadow-lg mb-8 overflow-hidden">
            {/* Content */}
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Case Study
              </h2>
              <p className="text-white text-lg max-w-3xl mx-auto">
                Explore detailed insights and in-depth analysis of various case studies,
                helping you understand market trends, strategies, and innovations.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case studies..."
                  className="w-full p-4 pl-12 border rounded-lg focus:outline-none focus:ring-2 bg-white/90 focus:ring-blue-300 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          {/* Case Study Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaseStudies.map((study, index) => (
              <CaseStudyCard
                key={index}
                title={study.title}
                description={study.description}
                imageUrl={study.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;