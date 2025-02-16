// src/components/Roadmap.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Menu } from 'lucide-react';

const Roadmap = () => {
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapWeeks, setRoadmapWeeks] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('id');
  const apiUrl = 'http://localhost:3001';
  const navigate = useNavigate();

  useEffect(() => {
    if (!candidateId) {
      alert('Candidate ID is missing. Redirecting to the main page.');
      navigate('/');
      return;
    }
    fetch(`${apiUrl}/results/${encodeURIComponent(candidateId)}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch candidate info.');
        return response.json();
      })
      .then((data) => setCandidateInfo(data))
      .catch((error) => {
        console.error('Error fetching candidate info:', error);
        alert('Error: ' + error.message);
      });
  }, [candidateId, navigate, apiUrl]);

  const generateRoadmap = async () => {
    const duration = document.getElementById('duration').value;
    const courseType = document.getElementById('course-type').value;
    const customInstructions = document.getElementById('custom-instructions').value;
    const payload = { candidateId, duration, courseType, customInstructions };

    try {
      const response = await fetch(`${apiUrl}/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to generate roadmap.');
      }
      const data = await response.json();
      setRoadmapData(data);

      // Group the roadmap text into weeks: a new week starts when a line begins with "Week"
      if (data.plainRoadmap) {
        const lines = data.plainRoadmap.split('\n').filter(line => line.trim() !== '');
        const weeks = [];
        let currentWeek = [];
        lines.forEach((line) => {
          if (line.toLowerCase().startsWith('week')) {
            // If we already have content for a week, push it and start a new group.
            if (currentWeek.length > 0) {
              weeks.push(currentWeek);
            }
            currentWeek = [line];
          } else {
            currentWeek.push(line);
          }
        });
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        setRoadmapWeeks(weeks);

        // Initialize a checkbox state for each week
        const initialStates = {};
        weeks.forEach((_, index) => {
          initialStates[index] = false;
        });
        setCheckboxStates(initialStates);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleCheckboxChange = (index) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleReassess = () => {
    navigate('/');
  };

  return (
    <>
      {/* Global Styles & Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .gradient-button {
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
        }
        .gradient-button:hover {
          opacity: 0.9;
        }
      `}</style>

      {/* Navigation Bar */}
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
                  <User size={20} />
                </button>
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
      <div className="min-h-screen bg-white text-gray-900 font-sans pt-20">
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 animate-fadeIn">
          <h1 className="text-center text-3xl font-bold mb-6">Generate Your Personalized Roadmap</h1>
          <div id="candidate-info" className="mb-4">
            <p id="candidate-name" className="mb-1">
              {candidateInfo ? `Name: ${candidateInfo.candidate_name}` : 'Loading candidate info...'}
            </p>
            <p id="domain">
              {candidateInfo ? `Domain: ${candidateInfo.domain}` : 'Loading domain...'}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block font-bold mb-1">Select Roadmap Duration:</label>
            <select
              id="duration"
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="course-type" className="block font-bold mb-1">Select Course Type:</label>
            <select
              id="course-type"
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="both">Both Free and Paid</option>
              <option value="free">Free Courses Only</option>
              <option value="paid">Paid Courses Only</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="custom-instructions" className="block font-bold mb-1">Additional Instructions (optional):</label>
            <textarea
              id="custom-instructions"
              placeholder="Enter any additional instructions for your roadmap here..."
              rows="4"
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>
          <button
            onClick={generateRoadmap}
            className="mt-4 w-full px-4 py-2 gradient-button text-white rounded hover:shadow-lg transition transform hover:scale-105"
          >
            Generate Roadmap
          </button>

          {roadmapData && roadmapWeeks.length > 0 && (
            <>
              <div className="mt-8 animate-fadeIn">
                <h2 className="text-center text-2xl font-bold mb-4">Your Detailed Roadmap</h2>
                <div id="roadmap">
                  {roadmapWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="mb-6 p-4 border rounded">
                      {week[0] && (
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold">{week[0]}</p>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checkboxStates[weekIndex] || false}
                              onChange={() => handleCheckboxChange(weekIndex)}
                              className="mr-2"
                            />
                            <label className="text-sm">Mark Week {weekIndex + 1} Complete</label>
                          </div>
                        </div>
                      )}
                      {week.slice(1).map((line, lineIndex) => (
                        <p key={lineIndex} className="mb-1">{line}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleReassess}
                  className="px-6 py-2 gradient-button text-white rounded hover:shadow-lg transition transform hover:scale-105"
                >
                  Reassess Yourself
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Roadmap;
