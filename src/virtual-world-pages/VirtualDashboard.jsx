import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes,FaDownload, FaArrowLeft, FaComments, FaUserShield, FaUsers, FaCog, FaQuestionCircle, FaClock, FaVideo } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const VirtualDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const today = "Thursday";
  const navigate = useNavigate()

  const data = [
    { day: "Mon", completed: 100 },
    { day: "Tue", completed: 100 },
    { day: "Wed", completed: 100 },
    { day: "Thu", completed: 50 },
    { day: "Fri", completed: 0 },
    { day: "Sat", completed: 0 },
  ];
  
  const [showModal, setShowModal] = useState(false);
  const handleDownloadClick = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-900 text-white flex">
      
      {/* Sidebar Toggle (Right Side) */}
      <button
        className="md:hidden p-4 fixed top-4 right-4 z-50 bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar (Properly Aligned) */}
      <div className={`fixed top-0 left-0 h-screen w-64 md:w-1/5 bg-gray-900 shadow-lg rounded-r-lg transition-transform duration-500 md:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
  {/* Dashboard Heading - Centered at the Top */}
  <h2 className="text-3xl font-bold text-center py-6">MetaMind</h2>

  {/* Sidebar Menu - Left Aligned with Padding */}
  <ul className="w-full text-left p-8 space-y-6">
    {[
      { icon: <FaComments />, text: "Chats" },
      { icon: <FaUserShield />, text: "Administration" },
      { icon: <FaUsers />, text: "Team Mates" },
      { icon: <FaCog />, text: "Settings" },
      { icon: <FaQuestionCircle />, text: "Help" },
    ].map((item, index) => (
      <li key={index} className="hover:text-yellow-300 cursor-pointer flex items-center gap-3 text-xl transition-all duration-300 hover:scale-110">
        {item.icon} {item.text}
      </li>
    ))}
  </ul>
</div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        
        {/* Navbar with Back Button (Large Screens) */}
        <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold">Company: Tech Innovators</h1>
          <button onClick={() => navigate('/welcomepage')} className="hidden md:flex items-center text-white text-lg hover:text-gray-400 transition-all duration-300 hover:scale-110">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Project Name & Description */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold">Web Developer</h1>
          <p className="text-gray-300 mt-2">This project focuses on building a scalable and interactive web application using modern frameworks like React and Node.js.</p>
        </div>

        {/* Graph & Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Weekly Task Completed Graph */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-[40vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Weekly Task Completed Graph</h2>
            <p className="text-yellow-400 text-lg font-semibold">Today: {today}</p>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data}>
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completed" fill="#4F46E5">
                  <LabelList dataKey="completed" position="top" fill="white" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Today's Tasks */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-[40vh]">
            <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
            {["Complete UI Design", "Implement API Integration", "Test and Debug Features"].map((task, index) => (
              <div key={index} className='mb-6'>
                <h3 className='font-semibold'>{task}</h3>
                <div className='w-full bg-gray-700 rounded-full h-3 mt-1'>
                  <div className='bg-blue-500 h-3 rounded-full' style={{ width: `${(index + 1) * 30}%` }}></div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Section: Group Meeting & Chat (With Features Restored) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Group Meeting */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FaClock /> Group Meeting</h2>
            <p className="text-gray-400 mt-2">Next Meeting: 15th March, 3 PM IST</p>
            <button  onClick={() => navigate("/meetingroom")}  className="mt-auto bg-green-600 w-1/2 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center justify-center gap-2 self-end">
              <FaVideo /> Join Meeting
            </button>
          </div>

          {/* Group Chat (Features Restored) */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2"><FaComments /> Group Chat</h2>
              <p className="text-green-400 text-sm">● Online</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(num => (
                  <img key={num} src={`https://randomuser.me/api/portraits/men/${num}.jpg`} className="w-8 h-8 rounded-full border-2 border-blue-500" alt={`User${num}`} />
                ))}
                <span className="text-gray-400 text-sm pl-2">+6 more</span>
              </div>
              <p className="text-gray-400 text-sm">Active Members: 10</p>
            </div>
            <button onClick={() => navigate('/chat')} className="mt-auto bg-blue-600 w-1/2 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2 self-end">
              <FaComments /> Join Chat
            </button>
          </div>

 

        </div>
        
          <button onClick={handleDownloadClick}  className="fixed bottom-6 left-6 bg-purple-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
        <FaDownload /> Download Certificate
      </button>
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-96 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Certificate Download</h2>
      <p className="text-gray-300 mb-4">
        Project is not yet completed. You will receive the certificate once the project is finished.
      </p>
      <button 
        onClick={() => setShowModal(false)} 
        className="bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-red-600 transition-all duration-300"
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
      
    </div>
  );
};

export default VirtualDashboard;
