import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell, User, Menu, Bookmark, Search, Filter, Star, ChevronDown, MapPin, Clock, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const projectsData = [
  {
    id: 4,
    name: "Web Developer",
    company: "Infosys",
    location: "San Francisco, CA",
    duration: "2 Months",
    skills: ["Vue.js", "Django", "AI"],
    applicants: 10,
    seatsAvailable: 4,
    difficulty: "Intermediate"
  },
  {
    id: 4,
    name: "Web Developer",
    company: "TCs",
    location: "San Francisco, CA",
    duration: "1 Months",
    skills: ["Node.js", "Django", "AI"],
    applicants: 5,
    seatsAvailable: 1,
    difficulty: "Intermediate"
  },
  {
    id: 4,
    name: "Web Developer",
    company: "47Billions",
    location: "San Francisco, CA",
    duration: "1.5 Months",
    skills: ["React", "js", "AI"],
    applicants: 10,
    seatsAvailable: 4,
    difficulty: "Intermediate"
  },
];

const VirtualCompanyProjects = () => {
  const [search, setSearch] = useState("");
  const [savedProjects, setSavedProjects] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const navigate = useNavigate();

  const handleSave = (id) => {
    setSavedProjects((prev) => {
      const newSaved = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return newSaved;
    });
  };

  const filteredAndSortedProjects = projectsData
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                          project.company.toLowerCase().includes(search.toLowerCase()) ||
                          project.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
      
      if (selectedFilter === "all") return matchesSearch;
      if (selectedFilter === "saved") return matchesSearch && savedProjects.includes(project.id);
      if (selectedFilter === "available") return matchesSearch && project.seatsAvailable > 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.id - a.id;
      if (sortBy === "salary") return parseInt(b.salary) - parseInt(a.salary);
      if (sortBy === "duration") return parseInt(a.duration) - parseInt(b.duration);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft size={20} className="transform transition-transform hover:rotate-12" />
              </button>
              <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                MetaMind
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {["Home", "Courses", "Community", "Resources"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110 relative">
                <Bell size={20} className="transform transition-transform hover:rotate-12" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110"
                >
                  <User size={20} className="transform transition-transform hover:rotate-12" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 transform transition-all duration-300 animate-slideIn">
                    {["Profile", "Settings", "Help Center"].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:translate-x-2"
                      >
                        {item}
                      </a>
                    ))}
                    <hr className="border-gray-800 my-1" />
                    <a href="#" className="block px-4 py-2 text-red-400 hover:bg-gray-800 transition-all duration-300 hover:translate-x-2">
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-20 px-4 md:px-16 relative max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
            Virtual Company Projects
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
            Gain real-world experience through virtual internships with leading tech companies
          </p>
        </div>
        
        {showNotification && (
          <div className="fixed top-20 right-4 w-72 bg-green-500/90 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slideIn">
            <p>
              Project {savedProjects.includes(savedProjects[savedProjects.length - 1]) ? "saved" : "removed"} successfully!
            </p>
          </div>
        )}
        
        <div className="sticky top-20 z-40 bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg border border-gray-800 mb-8 transform transition-all duration-300 hover:border-blue-500/50">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 group-hover:scale-110" size={20} />
              <input
                type="text"
                placeholder="Search projects, companies, or skills..."
                className="w-full pl-10 p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-500/50"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="saved">Saved</option>
                <option value="available">Available Seats</option>
              </select>
              
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-500/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={`bg-gray-900 border border-gray-800 rounded-lg transition-all duration-500 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-2 ${
                animateCards ? 'animate-fadeInUp' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2 transition-all duration-300 hover:text-blue-400">{project.name}</h2>
                    <p className="text-blue-400 font-medium">{project.company}</p>
                  </div>
                  <button 
                    onClick={() => handleSave(project.id)}
                    className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110"
                  >
                    <Bookmark 
                      size={20} 
                      className={`transition-all duration-300 transform hover:scale-110 ${
                        savedProjects.includes(project.id) ? "fill-blue-500 text-blue-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-400 group">
                    <MapPin size={16} className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-gray-400 group">
                    <Clock size={16} className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                    {project.duration}
                  </div>
                  <div className="flex items-center text-gray-400 group">
                    <Users size={16} className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                    {project.seatsAvailable} seats available
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-sm transition-all duration-300 hover:scale-105 hover:bg-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center group">
                    <Star className="text-yellow-500 fill-yellow-500 mr-1 transition-transform duration-300 group-hover:scale-110" size={16} />
                    <span className="text-gray-400">{project.rating}</span>
                  </div>
                  <span className="text-green-400 font-medium">{project.salary}</span>
                </div>
                
                <div onClick={()=> navigate('/aiinterview')} className="flex gap-3">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    Apply Now
                  </button>
                  <button className="px-4 py-2 border border-gray-700 hover:border-blue-500 rounded-lg transition-all duration-300 hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="fixed bottom-8 right-8">
          <div className="text-center mb-4 bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg border border-gray-800 transform transition-all duration-300 hover:scale-110 hover:border-blue-500/50">
            <p className="text-sm text-gray-400 mb-1">Saved Projects</p>
            <p className="text-2xl font-bold text-blue-400">{savedProjects.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCompanyProjects;