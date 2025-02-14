import React, { useState, useEffect } from "react";
import { Search, Filter, Award, Youtube, ExternalLink, ArrowLeft, Bell, User, Menu } from 'lucide-react';
import { 
  FaSearch, 
  FaStar, 
  FaCodeBranch, 
  FaArrowLeft, 
  FaBell, 
  FaBars 
} from "react-icons/fa";

const OpenSourceProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ language: "", category: "" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch projects from GitHub API on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // This example fetches repositories with more than 1000 stars sorted by stars descending.
        const response = await fetch(
          "https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc"
        );
        const data = await response.json();
        // GitHub returns the repositories in the 'items' field.
        setProjects(data.items);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term and filter options
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLanguage = filter.language
      ? project.language === filter.language
      : true;
    // GitHub repositories don't include a "category" field by default.
    // (You can enhance this by leveraging topics if you wish.)
    const matchesCategory = filter.category
      ? project.topics?.includes(filter.category.toLowerCase())
      : true;
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  // Load more projects (simulate pagination)
  const loadMore = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Fixed Navbar */}
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
                  <User  size={20} />
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

      {/* Hero Banner / Page Header */}
      <header className="py-12 text-center mt-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent transition-transform duration-500 transform hover:scale-105">
          Open Source Projects
        </h1>
        <p className="mt-4 text-xl text-gray-800">
          Discover, contribute, and collaborate on innovative open-source projects.
        </p>
      </header>

      {/* Search & Filter Section */}
      <section className="flex items-center justify-center bg-gray-50">
  <div className="w-full max-w-4xl px-3">
    <div className="relative">
      <input
        type="text"
        placeholder="Search projects..."
        className="w-full p-6 pl-16 text-2xl border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
    </div>
  </div>
</section>
      {/* Projects Listing */}
      <section className="container mx-auto px-4 py-6">
  {/* Section Heading */}
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
    Featured Open Source Projects
  </h2>

  {filteredProjects.length === 0 ? (
    <p className="text-center text-gray-600">No projects found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProjects.slice(0, visibleProjects).map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6"
        >
          {/* Project Thumbnail */}
          {project.owner && project.owner.avatar_url && (
            <img
              src={project.owner.avatar_url}
              alt={project.name}
              className="h-48 w-full object-cover rounded-md mb-4"
            />
          )}
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            {project.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {project.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              {project.language}
            </span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-yellow-500">
                <FaStar />
                <span className="ml-1 text-gray-700">
                  {project.stargazers_count}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <FaCodeBranch />
                <span className="ml-1 text-gray-700">
                  {project.forks_count}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedProject(project)}
            className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Load More / Pagination */}
  {visibleProjects < filteredProjects.length && (
    <div className="text-center mt-8">
      <button
        onClick={loadMore}
        className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors duration-300"
      >
        Load More
      </button>
    </div>
  )}
</section>


      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            {selectedProject.owner && selectedProject.owner.avatar_url && (
              <img
                src={selectedProject.owner.avatar_url}
                alt={selectedProject.name}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-700">{selectedProject.description}</p>
            <div className="flex gap-4 mt-4">
              <a
                href={selectedProject.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:from-blue-600 hover:to-purple-600 transition duration-300"
              >
                Repository
              </a>
              {selectedProject.homepage && (
                <a
                  href={selectedProject.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenSourceProjects;
