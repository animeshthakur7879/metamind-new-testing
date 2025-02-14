import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { AlertCircle, Bell, Settings, Calendar, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IndustryHome = () => {
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
    const togglePopup = () => {
      setIsPopupVisible(!isPopupVisible);
  };

  const toggleSubmitProjectPopup = () => {
      setIsSubmitProjectVisible(!isSubmitProjectVisible);
  };

  const toggleVirtualProjectsList = () => {
      setIsVirtualProjectsListVisible(!isVirtualProjectsListVisible);
  };

  const toggleSubmittedProjectsList = () => {
      setIsSubmittedProjectsListVisible(!isSubmittedProjectsListVisible);
  };

    // Notification system
    const addNotification = (message) => {
        const newNotification = {
            id: Date.now(),
            message,
            timestamp: new Date()
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    // Update time
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Create Enhanced Pie Chart
    const createPieChart = () => {
        const ctx = chartRef.current.getContext('2d');
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Ongoing', 'New Created'],
                datasets: [{
                    data: [20, 30, 50],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(249, 115, 22, 0.8)'
                    ],
                    borderColor: 'rgba(17, 24, 39, 1)',
                    borderWidth: 2,
                    hoverOffset: 15,
                }]
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
                        displayColors: true,
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
        addNotification("New project deadline approaching: UX/UI Workshop");
        addNotification("Team meeting scheduled for tomorrow");
    }, []);

    // Project search functionality
    const projects = [
        { name: "UX/UI Workshop", domain: "Design", deadline: "20th Feb" },
        { name: "Interaction Design", domain: "UX", deadline: "25th Feb" }
    ];

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-black to-blue-900 text-gray-100">
            {/* Enhanced Sidebar */}
            <motion.div 
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="bg-gray-900 w-64 p-6 rounded-r-3xl shadow-2xl"
            >
                <div className="flex items-center mb-8">
                    <img alt="Logo" className="w-10 h-10 rounded-full mr-3" src="meta mind no bg.png" />
                    <span className="font-bold text-lg text-white">META MIND</span>
                </div>
                <nav className="space-y-4">
                    <a className="flex items-center text-blue-400 transition duration-300 hover:text-blue-500" href="#dashboard">
                        <i className="fas fa-tachometer-alt mr-3"></i> Dashboard
                    </a>
                    <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="#projects">
                        <i className="fas fa-project-diagram mr-3"></i> Projects
                    </a>
                    <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="#reports">
                        <i className="fas fa-file-alt mr-3"></i> Reports
                    </a>
                    <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="#meetings">
                        <i className="fas fa-handshake mr-3"></i> Contact Us
                    </a>
                    <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="#chat">
                        <i className="fas fa-comments mr-3"></i> Chat With Us
                    </a>
                    <a className="flex items-center text-gray-400 transition duration-300 hover:text-gray-300" href="#progress">
                        <i className="fas fa-chart-line mr-3"></i> Progress
                    </a>
                    <a href="#virtual-room" className="flex items-center text-gray-400 cursor-pointer transition duration-300 hover:text-gray-300" onClick={togglePopup}>
                        <i className="fas fa-door-open mr-3"></i> Create Virtual Room
                    </a>
                    <a href="#submit-project" className="flex items-center text-gray-400 cursor-pointer transition duration-300 hover:text-gray-300" onClick={toggleSubmitProjectPopup}>
                        <i className="fas fa-upload mr-3"></i> Submit Project
                    </a>
                </nav>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Header with Search and Time */}
                <div className="flex justify-between items-center mb-8">
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl font-bold text-white"
                    >
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
                        
                        <div className="text-gray-400">
                            {currentTime.toLocaleTimeString()}
                        </div>
                        
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
                            {notifications.map(notification => (
                                <div key={notification.id} className="py-2 border-b border-gray-700">
                                    <p className="text-sm">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {notification.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* ... Enhanced stat cards with motion ... */}
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
                        <p className="text-2xl font-bold text-white">5</p>
                    </motion.div>

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
                        <p className="text-2xl font-bold text-white">3</p>
                        {isVirtualProjectsListVisible && (
                            <div className="project-list mt-2 bg-gray-700 rounded-md p-2">
                                <ul>
                                    <li><a href="#" className="text-blue-400">Project 1</a></li>
                                    <li><a href="#" className="text-blue-400">Project 2</a></li>
                                    <li><a href="#" className="text-blue-400">Project 3</a></li>
                                </ul>
                            </div>
                        )}
                    </motion.div>

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
                        <p className="text-2xl font-bold text-white">2</p>
                        {isSubmittedProjectsListVisible && (
                            <div className="project-list mt-2 bg-gray-700 rounded-md p-2">
                                <ul>
                                    <li><a href="#" className="text-blue-400">Project 1</a></li>
                                    <li><a href="#" className="text-blue-400">Project 2</a></li>
                                </ul>
                            </div>
                        )}
                    </motion.div>

                    {/* ... repeat for other cards ... */}
                </div>

                {/* Charts and Timeline Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-4 text-white">Project Status</h2>
                        <div className="chart-container">
                            <canvas ref={chartRef} className="chart-canvas"></canvas>
                        </div>
                    </motion.div>

                    {/* Timeline Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-4 text-white">Project Timeline</h2>
                        <div className="space-y-4">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={index}
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
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
                    <div className="space-y-4">
                        {/* Sample activity items */}
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

            {/* Enhanced Popup Forms */}
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
                            {/* ... Enhanced form content ... */}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Similar AnimatePresence wrapper for Submit Project popup */}
        </div>
    );
};

export default IndustryHome;