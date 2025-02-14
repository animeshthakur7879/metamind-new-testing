import React, { useState, useEffect } from 'react';
import { 
  Search, Grid, Book, Calendar, MessageCircle, 
  Users, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfileError("Not logged in");
      setLoadingProfile(false);
      return;
    }

    fetch("http://localhost:3000/profile", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile data");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoadingProfile(false);
      })
      .catch((err) => {
        setProfileError(err.message);
        setLoadingProfile(false);
      });
  }, []);

  // Fetch progress data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/progress", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch progress data");
          return res.json();
        })
        .then(data => setProgress(data))
        .catch(err => console.error("Error fetching progress:", err));
    }
  }, []);

  const cardData = [
    {
      title: "Skill Surge",
      description: "Upgrade your skills with industry-driven courses and hands-on exercises.",
      gradient: "bg-gradient-to-tr from-indigo-700 to-blue-500",
      button: "Start Learning",
      path: "/skillsurge"
    },
    {
      title: "AI-Driven Courses",
      description: "AI-powered personalized courses designed to enhance skills.",
      gradient: "bg-gradient-to-tr from-blue-500 to-purple-500",
      button: "Let AI Grade You",
      path: "/chatassistant"
    },
    {
      title: "The Self Check",
      description: "Take a self-assessment to gauge your readiness.",
      gradient: "bg-gradient-to-tr from-purple-500 to-indigo-700",
      button: "Access Yourself",
      path: "/assesmentportal"
    },
    {
      title: "Real World Case Study",
      description: "Learn how companies tackle major challenges.",
      gradient: "bg-gradient-to-tr from-indigo-700 to-blue-500",
      button: "Explore Cases",
      path: "/casestudymain"
    },
    {
      title: "Code And Contribute",
      description: "Collaborate on open-source projects and make your mark.",
      gradient: "bg-gradient-to-tr from-blue-500 to-purple-500",
      button: "View Now",
      path: "/codecontribute"
    },
    {
      title: "Unlock Virtual World",
      description: "Complete all required steps to enter the virtual world.",
      gradient: "bg-gradient-to-tr from-purple-500 to-indigo-700",
      button: "View Stats",
      path: "/buildingpage"
    }
  ];

  const handleClick = (card) => {
    navigate(card.path);
  };

  const handleNavClick = (item) => {
    if (item.label === "Logout") {
      // Remove the token (and any other user data if needed)
      localStorage.removeItem("token");
      // Redirect to login page
      navigate('/');
    } else if (item.route) {
      navigate(item.route);
    }
  };


    const navItems = [
      { icon: Grid, label: "Dashboard", route: '/studentdashboard' },
      { icon: Book, label: "Courses" },
      { icon: Calendar, label: "Schedule", route: '/studentschedule' },
      { icon: MessageCircle, label: "Messages", route: '/chatpage' },
      { icon: Users, label: "Community", route: '/communitypage' },
      { icon: Settings, label: "Settings" },
      { icon: LogOut, label: "Logout" }
    ];

  return (
    <div className="min-h-screen overflow-auto bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Left Navigation Bar */}
 {/* Left Navigation Bar */}
<motion.div
  initial={{ x: 0 }} // Visible by default
  animate={{
    x: isMobileMenuOpen || window.innerWidth >= 1024 ? 0 : -300, // Only animate on mobile when menu is toggled
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  className={`
    fixed lg:static 
    w-64 lg:w-20 
    bg-indigo-600
    min-h-screen 
    flex flex-col 
    items-center 
    py-8 
    gap-8 
    z-40
    shadow-xl
  `}
>
  {/* Logo */}
  <motion.div
    whileHover={{ scale: 1.1 }}
    onClick={() => navigate('/studentprofile')}
    className="w-12 h-12 rounded-xl mb-8 bg-cover cursor-pointer"
    style={{ backgroundImage: "url('https://tse3.mm.bing.net/th?id=OIP.--sB_AG8cxvPbn4tFQU4YAHaJ4&pid=Api&P=0&h=180')" }}
  />

  {/* Nav Items */}
  {navItems.map((item, index) => (
    <motion.button
      key={index}
      onClick={() => handleNavClick(item)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-3 w-48 lg:w-auto relative"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <item.icon size={24} />
      {hoveredIndex === index && (
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-14 bg-white text-purple-600 px-3 py-1 rounded-md text-sm shadow-lg"
        >
          {item.label}
        </motion.span>
      )}
    </motion.button>
  ))}
</motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8 pt-16 lg:pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content Section */}
          <div className="w-full lg:w-[400px] order-2 lg:order-1">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Hello, {profile?.fullName || "Student"} 👋
              </h1>
              <p className="text-gray-500">
                Welcome back! Ready to continue your learning journey?
              </p>
              {loadingProfile && <p className="text-gray-500">Loading profile...</p>}
              {profileError && <p className="text-red-500">{profileError}</p>}
            </motion.div>

            {/* Info Boxes */}
            <div className="space-y-6">
              {/* Current Course */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-green-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Current Course</h3>
                </div>
                {progress && progress.enrolled_courses && progress.enrolled_courses.trim() !== '' ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold">79%</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {progress.enrolled_courses.split(',')[0]}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Next class in 2 hours
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No current course enrolled.</p>
                )}
              </motion.div>

              {/* Active Course */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Active Course</h3>
                </div>
                {progress && progress.enrolled_courses && progress.enrolled_courses.split(',').length > 1 ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold">64%</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {progress.enrolled_courses.split(',')[1]}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Next class tomorrow
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No active course enrolled.</p>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="font-bold text-gray-800">Your Stats</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" /> Total Credits
                    </span>
                    <span className="font-medium text-gray-700">
                      {progress ? progress.credits : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Award className="w-4 h-4 mr-1" /> Badges Earned
                    </span>
                    <span className="font-medium text-gray-700">
                      {progress ? progress.badges : 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-8"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for courses, assignments, or resources..."
                className="w-full bg-white pl-12 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            {/* Feature Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              {cardData.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`${card.gradient} p-5 rounded-xl text-white flex flex-col justify-between h-[180px] shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <div>
                    <p className="text-sm text-blue-100 mb-3">{card.description}</p>
                    <button
                      onClick={() => handleClick(card)}
                      className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    >
                      {card.button}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
              <div className="relative h-[200px] md:h-[300px]">
                {/* Graph Grid Lines */}
                {[0, 1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="absolute w-full h-px bg-gray-100"
                    style={{ top: `${line * 25}%` }}
                  />
                ))}
                
                {/* Month Labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-gray-400 text-xs md:text-sm">
                  {['Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>

                {/* Placeholder for actual graph visualization */}
                <div className="absolute inset-0 mt-4 mb-6">
                  <div className="h-full bg-gradient-to-b from-indigo-50 to-transparent rounded-lg" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;