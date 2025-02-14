import React, { useState } from 'react';
import { Search, Filter, Award, Youtube, ExternalLink, ArrowLeft, Bell, User, Menu } from 'lucide-react';

const SkillSurge = () => {
  const [skill, setSkill] = useState("");
  const [price, setPrice] = useState("All");
  const [level, setLevel] = useState("All");
  const [certificate, setCertificate] = useState("All");
  const [youtubePlaylist, setYoutubePlaylist] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.append("skill", skill);
    if (price !== "All") params.append("price", price);
    if (level !== "All") params.append("level", level);
    if (certificate !== "All") params.append("certificate", certificate);
    if (youtubePlaylist === "Youtube Playlist Only") {
      params.append("youtubePlaylist", "true");
    }

    try {
      const response = await fetch(`http://localhost:3000/api/courses?${params.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
    }
    setLoading(false);
  };

  const SelectField = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="relative flex-1">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </div>
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 
                 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 transition-all duration-200"
      >
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Top Navigation */}
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

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-800 mb-6 tracking-tight">
            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Surge</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover courses tailored to your skills and accelerate your learning journey in the digital age.
          </p>
        </section>

        {/* Search Section */}
        <section className="relative mb-16">
          <div className="bg-white shadow-xl rounded-2xl">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Skill Input */}
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Search size={16} />
                      Search Skill
                    </div>
                  </label>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 
                             text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter a skill (e.g., React, Python, Design)"
                    required
                  />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Price Range"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    options={["All", "Free", "Paid"]}
                    icon={Filter}
                  />
                  <SelectField
                    label="Difficulty Level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    options={["All", "Beginner", "Intermediate", "Expert"]}
                    icon={Filter}
                  />
                  <SelectField
                    label="Certification"
                    value={certificate}
                    onChange={(e) => setCertificate(e.target.value)}
                    options={["All", "Provides Certificate", "No Certificate"]}
                    icon={Award}
                  />
                  <SelectField
                    label="Content Type"
                    value={youtubePlaylist}
                    onChange={(e) => setYoutubePlaylist(e.target.value)}
                    options={["All", "Youtube Playlist Only"]}
                    icon={Youtube}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 
                           hover:to-purple-600 rounded-lg font-bold text-white shadow-lg transform 
                           transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 
                           focus:ring-purple-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    "Search Courses"
                  )}
                </button>
              </form>
              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
            Recommended Courses
          </h2>
          {loading && (
            <div className="text-center text-gray-600">Loading courses...</div>
          )}
          {!loading && courses.length === 0 && (
            <div className="text-center text-gray-600">No courses found. Try different filters.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div
                key={course.id}
                className="group bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px] rounded-xl 
                         overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="bg-white h-full rounded-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src='https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp'
                      alt='https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp'
                      className="w-full h-48 object-cover transform transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-500 text-sm">{course.provider}</span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        ⭐ <span className="text-gray-700">{course.reviews}</span>
                      </span>
                    </div>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r 
                               from-blue-500 to-purple-500 text-white font-semibold rounded-lg 
                               transition-all duration-200 hover:opacity-90"
                    >
                      GO TO COURSE
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkillSurge;