import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  Menu,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Activity,
  Trophy,
  X,
  Search,
  CircleUserRound,
  Gauge,
  FolderKanban,
  FileText,
  Handshake,
  MessageSquare,
  TrendingUp,
  Filter,
  Plus,
  ArrowLeft, // New Back Icon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = count;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(startValue + (value - startValue) * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}</span>;
};

const Sidebar = ({ isOpen, toggleSidebar, activeLink, profile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  
  const navLinks = [
    { icon: <Gauge className="w-5 h-5" />, text: 'Dashboard', href: '#dashboard' },
    { icon: <FolderKanban className="w-5 h-5" />, text: 'Projects', href: '#projects' },
    { icon: <Users className="w-5 h-5" />, text: 'Employees', href: '#employees' },
    { icon: <FileText className="w-5 h-5" />, text: 'Reports', href: '/report' },
    { icon: <Handshake className="w-5 h-5" />, text: 'Meetings', href: '/meetingroom' },
    { icon: <MessageSquare className="w-5 h-5" />, text: 'Chat', href: '/chat' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Progress', href: '#progress' },
  ];

  return (
    <div 
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0D1B2A] transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'w-64' : 'lg:w-20'} p-6 rounded-r-3xl shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close Sidebar Button */}
      <button
        className="lg:hidden absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-300"
        onClick={toggleSidebar}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/industryhome')}
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className={`${isOpen ? '' : 'lg:hidden'}`}>Back</span>
        </button>
      </div>

      {/* Brand */}
      <div className={`flex items-center mb-8 transition-all duration-300 ${!isOpen && 'lg:justify-center'}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          MM
        </div>
        <span className={`font-bold text-lg text-white ml-3 ${!isOpen && 'lg:hidden'}`}>
          META MIND
        </span>
      </div>

      {/* Search Bar */}
      <div className={`relative mb-6 ${!isOpen && 'lg:hidden'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={`flex items-center ${
              activeLink === link.text.toLowerCase() ? 'text-blue-400' : 'text-gray-400'
            } hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 group`}
          >
            <span className="mr-3 transition-transform duration-300 group-hover:scale-110">
              {link.icon}
            </span>
            <span className={`${!isOpen && 'lg:hidden'}`}>{link.text}</span>
          </a>
        ))}
      </nav>

      {/* Profile Section */}
      <div className={`absolute bottom-15 left-6 right-6 ${!isOpen && 'lg:left-0 lg:right-0 lg:flex lg:justify-center'}`}>
        <div className="flex items-center bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
          <CircleUserRound className="w-8 h-8 text-blue-400" />
          <div className={`ml-3 ${!isOpen && 'lg:hidden'}`}>
            <p className="text-sm font-medium text-white">
              {profile ? profile.fullName : 'John Doe'}
            </p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState('UI Design');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const notifications = [
    { id: 1, message: 'New task assigned', time: '2m ago' },
    { id: 2, message: 'Meeting in 30 minutes', time: '15m ago' },
    { id: 3, message: 'Project deadline updated', time: '1h ago' },
  ];

  const taskData = {
    'UI Design': [
      { name: 'Week 1', progress: 65, efficiency: 80 },
      { name: 'Week 2', progress: 78, efficiency: 85 },
      { name: 'Week 3', progress: 82, efficiency: 90 },
      { name: 'Week 4', progress: 90, efficiency: 88 },
    ],
    'Backend API': [
      { name: 'Week 1', progress: 45, efficiency: 70 },
      { name: 'Week 2', progress: 60, efficiency: 75 },
      { name: 'Week 3', progress: 75, efficiency: 85 },
      { name: 'Week 4', progress: 85, efficiency: 90 },
    ],
    Testing: [
      { name: 'Week 1', progress: 20, efficiency: 60 },
      { name: 'Week 2', progress: 40, efficiency: 70 },
      { name: 'Week 3', progress: 55, efficiency: 80 },
      { name: 'Week 4', progress: 70, efficiency: 85 },
    ],
  };

  const memberData = [
    { name: 'John Doe', position: 'Lead Developer', tasks: ['UI Design', 'Backend API'], completion: 85, activity: 90 },
    { name: 'Jane Smith', position: 'UI Designer', tasks: ['UI Design'], completion: 90, activity: 85 },
    { name: 'Mike Johnson', position: 'Backend Developer', tasks: ['Backend API', 'Testing'], completion: 75, activity: 80 },
    { name: 'Sarah Wilson', position: 'QA Engineer', tasks: ['Testing'], completion: 80, activity: 95 },
  ];

  const pieData = [
    { name: 'UI Design', value: 35 },
    { name: 'Backend API', value: 30 },
    { name: 'Testing', value: 20 },
    { name: 'Documentation', value: 15 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#000002] to-[#1C388C]">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} activeLink={activeLink} />
      
      <div className="flex-1 p-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button 
              className="text-gray-400 hover:text-white mr-4 transform hover:scale-110 transition-all duration-300" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              PROJECT NAME
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="text-gray-500 w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white animate-pulse">
                  <AnimatedCounter value={3} />
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl py-2 z-50 transform transition-all duration-300 animate-fadeIn">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-2 hover:bg-gray-700 transition-colors duration-300">
                      <p className="text-sm text-white">{notification.message}</p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Settings className="text-gray-500 w-6 h-6 cursor-pointer hover:text-blue-400 transition-all duration-300 hover:rotate-90" />
          </div>
        </div>

        <p className="text-gray-300 mb-10 animate-fadeIn">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio itaque corrupti atque ratione reprehenderit quisquam voluptatibus tempore quos in porro!
        </p>

        {/* Time Range Filter */}
        <div className="flex justify-end mb-4">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-4 mb-6">
          {['tasks', 'members', 'details'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Box */}
        <div className="bg-gray-800 rounded-lg p-6 transform transition-all duration-500 hover:shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Section - Details */}
            <div className="col-span-1">
              {selectedCategory === 'tasks' && (
                <div className="space-y-4">
                  {Object.keys(taskData).map((task) => (
                    <div
                      key={task}
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedTask === task 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{task}</span>
                        <span className="text-sm text-gray-300">
                          <AnimatedCounter 
                            value={taskData[task][taskData[task].length - 1].progress} 
                          />%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${taskData[task][taskData[task].length - 1].progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedCategory === 'members' && (
                <div className="space-y-4">
                  {memberData.map((member) => (
                    <div 
                      key={member.name} 
                      className="p-4 bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium mb-2">{member.name}</div>
                          <div className="text-sm text-gray-300 mb-2">{member.position}</div>
                          <div className="text-sm text-gray-400">Tasks: {member.tasks.join(', ')}</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Completion</span>
                          <span><AnimatedCounter value={member.completion} />%</span>
                        </div>
                        <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${member.completion}%` }}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Activity</span>
                          <span><AnimatedCounter value={member.activity} />%</span>
                        </div>
                        <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${member.activity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
  
              {selectedCategory === 'details' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <div className="text-white font-medium mb-2">Budget Overview</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl text-green-400 font-bold">
                        <AnimatedCounter value={75000} duration={2000} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                      <span className="text-green-400">▲ 12%</span> vs last month
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Budget Utilized</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: '65%' }}
                        />
                      </div>
                    </div>
                  </div>
  
                  <div className="p-4 bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <div className="text-white font-medium mb-4">Timeline</div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <div>
                          <div>Start Date</div>
                          <div className="text-white">Jan 1, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        <div>
                          <div>End Date</div>
                          <div className="text-white">Jun 30, 2024</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: '45%' }}
                        />
                      </div>
                    </div>
                  </div>
  
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="text-white font-medium mb-2">Work Distribution</div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            {/* Right Section - Graph */}
            <div className="col-span-2">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={
                    selectedCategory === 'tasks' 
                      ? taskData[selectedTask]
                      : selectedCategory === 'members'
                      ? memberData.map((member) => ({
                          name: member.name,
                          completion: member.completion,
                          activity: member.activity,
                        }))
                      : [
                          { name: 'Q1', value: 20000, forecast: 22000 },
                          { name: 'Q2', value: 25000, forecast: 26000 },
                          { name: 'Q3', value: 15000, forecast: 18000 },
                          { name: 'Q4', value: 15000, forecast: 20000 },
                        ]
                  }>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey={
                        selectedCategory === 'tasks'
                          ? 'progress'
                          : selectedCategory === 'members'
                          ? 'completion'
                          : 'value'
                      }
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorProgress)"
                      strokeWidth={3}
                    />
                    {selectedCategory === 'tasks' && (
                      <Area
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#colorEfficiency)"
                        strokeWidth={3}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
