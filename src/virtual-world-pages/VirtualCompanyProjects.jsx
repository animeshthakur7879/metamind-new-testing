import React, { useState } from "react";
import {  ArrowLeft, Bell, User, Menu } from 'lucide-react';

const projectsData = [
  {
    id: 4,
    name: "Web Developer",
    company: "InnoTech",
    duration: "5 Months",
    skills: ["Vue.js", "Django", "AI"],
    applicants: 10,
    seatsAvailable: 4,
  },
  {
    id: 5,
    name: "Web Developer",
    company: "CodeCrafters",
    duration: "6 Months",
    skills: ["Angular", "Firebase", "GraphQL"],
    applicants: 20,
    seatsAvailable: 8,
  },
  {
    id: 6,
    name: "Web Developer",
    company: "FutureTech",
    duration: "3 Months",
    skills: ["Svelte", "Node.js", "PostgreSQL"],
    applicants: 14,
    seatsAvailable: 5,
  },
  {
    id: 1,
    name: "Web Developer",
    company: "Tech Innovators",
    duration: "3 Months",
    skills: ["React", "Node.js", "AI/ML"],
    applicants: 12,
    seatsAvailable: 5,
  },
  {
    id: 2,
    name: "Web Developer",
    company: "ShopEase",
    duration: "2 Months",
    skills: ["Next.js", "MongoDB", "Tailwind"],
    applicants: 8,
    seatsAvailable: 3,
  },
  {
    id: 3,
    name: "Web Developer",
    company: "CryptoPay",
    duration: "4 Months",
    skills: ["Solidity", "Web3.js", "Ethereum"],
    applicants: 15,
    seatsAvailable: 6,
  },
];

const VirtualCompanyProjects = () => {
  const [search, setSearch] = useState("");
  const [savedProjects, setSavedProjects] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSave = (id) => {
    setSavedProjects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const filteredProjects = projectsData.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-black via-blue-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg">
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
      
      <div className="py-10 px-4 md:px-16 relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Virtual Company Projects</h1>
        
        {/* Interview Questions Button */}
        <button className="fixed top-25 border border-black animate-border-move right-4 bg-yellow-500 text-black px-4 py-2 animate-pulse rounded-lg font-bold shadow-lg hover:bg-yellow-600 z-50">
          Click Here for Interview Questions
        </button>
        
        
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full md:w-1/2 p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Projects List */}
        <div className="grid mt-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 animate-fade-in">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#1F2937] p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <h2 className="text-xl mb-2">{project.name}</h2>
              <p className="text-sm text-yellow-400 font-bold">Company: {project.company}</p>
              <p className="text-sm text-gray-400">Duration: {project.duration}</p>
              <p className="text-sm text-gray-400">Skills: {project.skills.join(", ")}</p>
              <p className="text-sm text-gray-400">Applicants: {project.applicants}</p>
              <p className="text-sm text-gray-400">Seats Available: {project.seatsAvailable}</p>
              
              {/* Buttons */}
              <div className="mt-4 flex gap-4">
                <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Apply</button>
                <button 
                  className={`px-4 py-2 rounded-lg ${savedProjects.includes(project.id) ? "bg-red-600" : "bg-gray-700"}`} 
                  onClick={() => handleSave(project.id)}
                >
                  {savedProjects.includes(project.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Total Saved Projects Count */}
        <div className="text-center mt-6 text-lg font-semibold text-yellow-400">
          Total Saved Projects: {savedProjects.length}
        </div>
      </div>
    </div>
  );
};

export default VirtualCompanyProjects;
