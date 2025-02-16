import React, { useState } from 'react';
import moment from 'moment';
import { Calendar as RBCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Grid, Book, Calendar, MessageCircle, Users, Settings, LogOut, 
  ChevronLeft, ChevronRight, Bell 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);


const StudentSchedulePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate()

  const navItems = [
    { icon: Grid, label: "Dashboard"  , route : '/studentdashboard'},
    { icon: Book, label: "Courses" },
    { icon: Calendar, label: "Schedule" },
    { icon: MessageCircle, label: "Messages" , route : '/chatpage' },
    { icon: Users, label: "Community" ,  route : '/communitypage' },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  const events = [
    {
      id: 1,
      title: 'Math Lecture',
      start: new Date(2023, 1, 20, 9, 0),
      end: new Date(2023, 1, 20, 10, 30),
    },
    {
      id: 2,
      title: 'Physics Lab',
      start: new Date(2023, 1, 21, 11, 0),
      end: new Date(2023, 1, 21, 12, 30),
    },
    {
      id: 3,
      title: 'History Seminar',
      start: new Date(2023, 1, 22, 14, 0),
      end: new Date(2023, 1, 22, 15, 30),
    },
    {
      id: 4,
      title: 'Art Workshop',
      start: new Date(2023, 1, 24, 10, 0),
      end: new Date(2023, 1, 24, 11, 30),
    },
    {
      id: 5,
      title: 'Chemistry Discussion',
      start: new Date(2023, 1, 23, 13, 0),
      end: new Date(2023, 1, 23, 14, 0),
    },
  ];

  const upcomingEvents = events.filter(event => event.start >= new Date());

  const goPrevious = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToday = () => {
    setSelectedDate(new Date());
  };

  return (
    
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Enhanced Sidebar with gradient */}
        <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:static 
        w-64 lg:w-20 
        bg-indigo-600
        min-h-screen 
        flex flex-col 
        items-center 
        py-8 
        gap-8 
        transition-all 
        duration-300 
        ease-in-out
        z-40
        shadow-xl
      `}>
        {/* Logo */}
        <div
          onClick={() => navigate('/studentprofile')}
          className="w-12 h-12 rounded-xl mb-8 bg-cover cursor-pointer transform hover:scale-110 transition-transform duration-200"
          style={{ backgroundImage: "url('https://tse3.mm.bing.net/th?id=OIP.--sB_AG8cxvPbn4tFQU4YAHaJ4&pid=Api&P=0&h=180')" }}
        />
        {/* Nav Items */}
        {navItems.map((item, index) => (
          <button
            onClick={() => navigate(item.route)}
            key={index}
            className="text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-3 w-48 lg:w-auto relative transform hover:scale-105"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <item.icon size={24} />
            {hoveredIndex === index && (
              <span className="absolute left-14 bg-white text-purple-600 px-3 py-1 rounded-md text-sm shadow-lg animate-fade-in">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

        {/* Main Content Area with subtle background */}
        <div className="flex-1 p-8 ml-0 lg:ml-20">
          {/* Enhanced Header */}
          <header className="flex flex-col md:flex-row items-center justify-between bg-white p-6 shadow-lg rounded-2xl mb-6
                           border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-tr from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Weekly Schedule
              </h1>
              <div className="flex items-center gap-2">
                <button onClick={goPrevious} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium px-2">
                  {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button onClick={goNext} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button onClick={goToday} 
                      className="px-4 py-2 bg-gradient-to-tr from-blue-500 to-purple-500 text-white rounded-lg
                               hover:shadow-lg transition-all duration-300 hover:scale-105">
                Today
              </button>
              <input 
                type="date" 
                className="border border-gray-300 rounded-lg p-2 text-sm hover:border-purple-400 transition-colors duration-300"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
          </header>

          {/* Enhanced Content Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar Section */}
            <div className="flex-1 bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
              <RBCalendar
                localizer={localizer}
                events={events}
                defaultView="week"
                views={['week', 'day', 'agenda']}
                step={30}
                timeslots={2}
                style={{ height: 500 }}
                date={selectedDate}
                onNavigate={(date) => setSelectedDate(date)}
                className="font-sans"
              />
            </div>

            {/* Enhanced Side Panel */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Upcoming Events Card */}
              <div className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-tr from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  Upcoming Events
                </h2>
                <ul className="space-y-4">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <li key={event.id} 
                        className="border-l-4 p-3 rounded-r-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        style={{ borderColor: "#4F46E5" }}>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-400">{event.start.toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enhanced Reminders Card */}
              <div className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-tr from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  Reminders
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <Bell size={16} className="text-purple-500" />
                    <span className="text-sm">Web Development Week 3 started</span>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 
                     text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedulePage;