import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { AlertCircle, Bell, Settings, Calendar, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IndustryHome = () => {
  // State for industry activity counts (from industry_activity table)
  const [industryActivity, setIndustryActivity] = useState({
    projects_submitted: 0,
    virtual_rooms_created: 0
  });

  // States for project lists (from submitted_projects and virtual_room_projects tables)
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [virtualRoomProjects, setVirtualRoomProjects] = useState([]);

  // Existing state variables
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSubmitProjectVisible, setIsSubmitProjectVisible] = useState(false);
  const [isVirtualProjectsListVisible, setIsVirtualProjectsListVisible] = useState(false);
  const [isSubmittedProjectsListVisible, setIsSubmittedProjectsListVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const chartRef = React.useRef(null);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Toggle functions
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  const toggleSubmitProjectPopup = () => setIsSubmitProjectVisible(!isSubmitProjectVisible);
  const toggleVirtualProjectsList = () => setIsVirtualProjectsListVisible(!isVirtualProjectsListVisible);
  const toggleSubmittedProjectsList = () => setIsSubmittedProjectsListVisible(!isSubmittedProjectsListVisible);

  // Notification system
  const addNotification = (message) => {
    const newNotification = { id: Date.now(), message, timestamp: new Date() };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Create Enhanced Pie Chart (static example data)
  const createPieChart = () => {
    const ctx = chartRef.current.getContext('2d');
    if (ctx.chart) {
      ctx.chart.destroy();
    }
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Ongoing', 'New Created'],
        datasets: [
          {
            data: [20, 30, 50],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(249, 115, 22, 0.8)'
            ],
            borderColor: 'rgba(17, 24, 39, 1)',
            borderWidth: 2,
            hoverOffset: 15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#fff', font: { size: 14 } }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            displayColors: true
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    ctx.chart = chart;
  };

  useEffect(() => {
    Chart.register(...registerables);
    createPieChart();
    // Add sample notifications
    addNotification('New project deadline approaching: UX/UI Workshop');
    addNotification('Team meeting scheduled for tomorrow');
  }, []);

  // Fetch industry activity data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    fetch('http://localhost:3000/api/industry_activity', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Fetched industry activity error:', data.error);
          setIndustryActivity({ projects_submitted: 0, virtual_rooms_created: 0 });
        } else {
          console.log('Fetched industry activity:', data);
          setIndustryActivity(data);
        }
      })
      .catch((err) => console.error('Error fetching industry activity:', err));
  }, []);

  // Fetch virtual room projects
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    fetch('http://localhost:3000/api/virtual_room_projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Fetched virtual room projects error:', data.error);
          setVirtualRoomProjects([]);
        } else {
          console.log('Fetched virtual room projects:', data);
          setVirtualRoomProjects(data);
        }
      })
      .catch((err) => console.error('Error fetching virtual room projects:', err));
  }, []);

  // Fetch submitted projects
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    fetch('http://localhost:3000/api/submitted_projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Fetched submitted projects error:', data.error);
          setSubmittedProjects([]);
        } else {
          console.log('Fetched submitted projects:', data);
          setSubmittedProjects(data);
        }
      })
      .catch((err) => console.error('Error fetching submitted projects:', err));
  }, []);

  // Total projects is the sum of submitted and virtual room projects
  const totalProjects =
    Number(industryActivity.projects_submitted) +
    Number(industryActivity.virtual_rooms_created);

  // Example static projects for the timeline (if needed)
  const projects = [
    { name: 'UX/UI Workshop', domain: 'Design', deadline: '20th Feb' },
    { name: 'Interaction Design', domain: 'UX', deadline: '25th Feb' }
  ];

  // For timeline filtering (using a static array in this example)
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logout function: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Adjust the URL as needed
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-black to-blue-900 text-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="bg-gray-900 w-64 p-6 rounded-r-3xl shadow-2xl flex flex-col "
      >
        <div>
          <div className="flex items-center mb-8">
            <img alt="Logo" className="w-10 h-10 rounded-full mr-3" src="meta mind no bg.png" />
            <span className="font-bold text-lg text-white">META MIND</span>
          </div>
          <nav className="space-y-4">
            <a className="flex items-center text-blue-400 transition duration-300 hover:text-blue-500" href="#dashboard">
              <i className="fas fa-tachometer-alt mr-3"></i> Dashboard
            </a>
            <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="/report">
              <i className="fas fa-file-alt mr-3"></i> Reports
            </a>
            <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="/contactus">
              <i className="fas fa-handshake mr-3"></i> Contact Us
            </a>
            <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="/chat">
              <i className="fas fa-comments mr-3"></i> Chat With Us
            </a>
            {/* Highlighted Options */}
            <a
              href="/vroom"
              className="flex items-center text-white font-bold cursor-pointer transition duration-300 hover:text-white"
              onClick={togglePopup}
            >
              <i className="fas fa-door-open mr-3"></i> Create Virtual Room
            </a>
            <a
              href="/submitprojectform"
              className="flex items-center text-white font-bold cursor-pointer transition duration-300 hover:text-white"
              onClick={toggleSubmitProjectPopup}
            >
              <i className="fas fa-upload mr-3"></i> Submit Project
            </a>
          </nav>
        </div>
        {/* Logout Button */}
        <div className="mt-8">
  <button 
    onClick={handleLogout}
    className="flex items-center justify-center px-4 py-2 
    bg-white border border-red-200 
    text-red-500 font-medium
    rounded-lg
    transition-colors duration-200
    hover:bg-red-50
    focus:outline-none focus:ring-1 focus:ring-red-200"
  >
    <i className="fas fa-sign-out-alt mr-2"></i>
    Logout
  </button>
</div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-white">
            DASHBOARD
          </motion.h1>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-gray-400">{currentTime.toLocaleTimeString()}</div>
            <div className="relative">
              <Bell
                className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </div>
            <Settings className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-8 top-20 bg-gray-800 rounded-lg shadow-xl p-4 w-80 z-50"
            >
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              {notifications.map((notification) => (
                <div key={notification.id} className="py-2 border-b border-gray-700">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.timestamp.toLocaleTimeString()}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Total Projects */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <i className="fas fa-project-diagram text-blue-600 text-2xl mr-3"></i>
              <span className="text-gray-500">Total Projects</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalProjects}</p>
          </motion.div>

          {/* Virtual Room Projects */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4 cursor-pointer" onClick={toggleVirtualProjectsList}>
              <i className="fas fa-door-open text-blue-600 text-2xl mr-3"></i>
              <span className="text-gray-500">Virtual Room Projects</span>
            </div>
            <p className="text-2xl font-bold text-white">{industryActivity.virtual_rooms_created}</p>
            {isVirtualProjectsListVisible && (
              <div className="project-list mt-2 bg-gray-700 rounded-md p-2">
                <ul>
                  {virtualRoomProjects.length > 0 ? (
                    virtualRoomProjects.map((project, index) => (
                      <li key={`virtual-${index}`}>
                        <a href="/industrydashboard" className="text-blue-400">
                          {project.project_name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li key="no-virtual-projects">No Virtual Room Projects Found</li>
                  )}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Submitted Projects */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4 cursor-pointer" onClick={toggleSubmittedProjectsList}>
              <i className="fas fa-upload text-blue-600 text-2xl mr-3"></i>
              <span className="text-gray-500">Submitted Projects</span>
            </div>
            <p className="text-2xl font-bold text-white">{industryActivity.projects_submitted}</p>
            {isSubmittedProjectsListVisible && (
              <div className="project-list mt-2 bg-gray-700 rounded-md p-2">
                <ul>
                  {submittedProjects.length > 0 ? (
                    submittedProjects.map((project) => (
                      <li key={`submitted-${project.project_id}`}>
                        <a href="/industrydashboard" className="text-blue-400">
                          {project.projectName}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li key="no-submitted-projects">No Submitted Projects Found</li>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Project Status</h2>
            <div className="chart-container">
              <canvas ref={chartRef} className="chart-canvas"></canvas>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Project Timeline</h2>
            <div className="space-y-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={`${project.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="text-sm text-gray-400">{project.domain}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    <p className="text-sm text-gray-400">{project.deadline}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm">New team member added to UX/UI Workshop</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm">Project milestone achieved</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup Form */}
      <AnimatePresence>
        {isPopupVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
            >
              {/* Enhanced form content can be added here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustryHome;
