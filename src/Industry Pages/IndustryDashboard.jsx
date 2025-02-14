import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  Gauge,
  FolderKanban,
  Users,
  FileText,
  Handshake,
  MessageSquare,
  TrendingUp,
  DoorOpen,
  Upload,
  ChevronDown,
  CheckCircle,
  Menu,
  X,
  CircleUserRound,
  Search,
  Calendar,
  Trophy,
  Activity,
  DollarSign,
  Award
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Sample performance data for the chart
const performanceData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 59 },
  { name: 'Wed', value: 80 },
  { name: 'Thu', value: 81 },
  { name: 'Fri', value: 56 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 40 },
];

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, activeLink, profile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navLinks = [
    { icon: <Gauge className="w-5 h-5" />, text: 'Dashboard', href: '#dashboard' },
    { icon: <FolderKanban className="w-5 h-5" />, text: 'Projects', href: '#projects' },
    { icon: <Users className="w-5 h-5" />, text: 'Employees', href: '#employees' },
    { icon: <FileText className="w-5 h-5" />, text: 'Reports', href: '#reports' },
    { icon: <Handshake className="w-5 h-5" />, text: 'Meetings', href: '#meetings' },
    { icon: <MessageSquare className="w-5 h-5" />, text: 'Chat', href: '#chat' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Progress', href: '#progress' },
    { 
      icon: <DoorOpen className="w-5 h-5" />, 
      text: 'Virtual Room', 
      href: '#virtual-room',
      highlight: true 
    },
    { 
      icon: <Upload className="w-5 h-5" />, 
      text: 'Submit your own project', 
      href: '#submit-project',
      highlight: true,
      isNew: true 
    },
  ];

  return (
    <div 
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0D1B2A] transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'w-64' : 'lg:w-20'} p-6 rounded-r-3xl shadow-xl`}
    >
      <button 
        className="lg:hidden absolute right-4 top-4 text-gray-400 hover:text-white"
        onClick={toggleSidebar}
      >
        <X className="w-6 h-6" />
      </button>

      <div className={`flex items-center mb-8 transition-transform duration-300 ${!isOpen && 'lg:justify-center'}`}>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          MM
        </div>
        <span className={`font-bold text-lg text-white ml-3 ${!isOpen && 'lg:hidden'}`}>
          META MIND
        </span>
      </div>

      <div className={`relative mb-6 ${!isOpen && 'lg:hidden'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <nav className="space-y-4">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={`flex items-center relative ${
              link.highlight 
                ? 'text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg' 
                : activeLink === link.text.toLowerCase() 
                  ? 'text-blue-400' 
                  : 'text-gray-400'
            } transition-all duration-300 hover:text-blue-400 hover:translate-x-2 group`}
          >
            <span className="mr-3">{link.icon}</span>
            <span className={`${!isOpen && 'lg:hidden'}`}>{link.text}</span>
            {link.isNew && (
              <span className="absolute -right-2 -top-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
            {!isOpen && (
              <div className="hidden lg:block absolute left-20 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {link.text}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* Bottom Sidebar: Dynamic User Info */}
      <div className={`absolute bottom-6 left-6 right-6 ${!isOpen && 'lg:left-0 lg:right-0 lg:flex lg:justify-center'}`}>
        <div className="flex items-center bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300">
          <CircleUserRound className="w-8 h-8 text-blue-400" />
          <div className={`ml-3 ${!isOpen && 'lg:hidden'}`}>
            <p className="text-sm font-medium text-white">
              {profile ? profile.fullName : "Loading..."}
            </p>
            <p className="text-xs text-gray-400">
              {profile && profile.role ? profile.role : "Admin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleItem = ({ day, title, progress, instructor, time }) => (
  <div className="flex justify-between items-center p-4 hover:bg-gray-700 rounded-lg transition-all duration-300 group">
    <div>
      <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{day}</p>
      <p className="text-gray-500">{title}</p>
      <p className="text-gray-500 text-sm">{progress} • {instructor}</p>
    </div>
    <div className="flex items-center">
      <Calendar className="w-4 h-4 text-gray-500 mr-2" />
      <p className="text-gray-500">{time}</p>
    </div>
  </div>
);

const AchievementCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  </div>
);

const InfoBoxes = ({ progress }) => {
  return (
    <div className="space-y-6">
      {/* Current Course */}
      <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <div className="flex items-center mb-4">
          <Calendar className="w-6 h-6 text-green-500 mr-2" />
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
                <Calendar className="w-4 h-4 mr-1" /> Next class in 2 hours
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No current course enrolled.</p>
        )}
      </div>

      {/* Active Course */}
      <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <div className="flex items-center mb-4">
          <Calendar className="w-6 h-6 text-blue-500 mr-2" />
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
                <Calendar className="w-4 h-4 mr-1" /> Next class tomorrow
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No active course enrolled.</p>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <div className="flex items-center mb-4">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="font-bold text-gray-800">Your Stats</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" /> Total Credits
            </span>
            <span className="font-medium text-gray-700">{progress ? progress.credits : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center">
              <Award className="w-4 h-4 mr-1" /> Badges Earned
            </span>
            <span className="font-medium text-gray-700">{progress ? progress.badges : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndustryDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch profile data
      fetch("http://localhost:3000/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch profile data");
          }
          return res.json();
        })
        .then(data => setProfile(data))
        .catch(err => console.error("Error fetching profile:", err));
      
      // Fetch progress data
      fetch("http://localhost:3000/progress", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch progress data");
          }
          return res.json();
        })
        .then(data => setProgress(data))
        .catch(err => console.error("Error fetching progress:", err));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#000002] to-[#1C388C]">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} activeLink={activeLink} profile={profile} />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button 
              className="text-gray-400 hover:text-white mr-4"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">DASHBOARD</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="text-gray-500 w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors duration-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
            </div>
            <Settings className="text-gray-500 w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors duration-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AchievementCard 
            title="Total Projects" 
            value="26" 
            icon={Trophy} 
            color="bg-blue-600"
          />
          <AchievementCard 
            title="Active Tasks" 
            value="12" 
            icon={Activity} 
            color="bg-green-600"
          />
          <AchievementCard 
            title="Team Members" 
            value="8" 
            icon={Users} 
            color="bg-purple-600"
          />
          <AchievementCard 
            title="Completed" 
            value="85%" 
            icon={CheckCircle} 
            color="bg-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              Project Performance
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Schedule
              </h2>
              <a className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center" href="#more">
                See more
                <ChevronDown className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="space-y-4">
              <ScheduleItem
                day="05"
                title="UX/UI Workshop"
                progress="10 of 45 chapters"
                instructor="Mrs. Wilson"
                time="14:00"
              />
              <ScheduleItem
                day="06"
                title="Interaction Design"
                progress="5 of 30 chapters"
                instructor="Mrs. Wilson"
                time="15:00"
              />
              <ScheduleItem
                day="07"
                title="Design Review"
                progress="15 of 24 tasks"
                instructor="Mr. Johnson"
                time="11:00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboard;
