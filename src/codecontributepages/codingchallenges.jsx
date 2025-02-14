// codingchallenges.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bell, User, Menu } from 'react-feather';
import { MessageSquare } from 'react-feather';

export default function CodingChallenges() {
  // -----------------------
  // New Navbar / Header Component
  // -----------------------
  const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white">MetaMind</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white">
                Home
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Courses
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Community
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Resources
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-white hover:bg-white/10 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full text-white hover:bg-white/10"
                >
                  <User size={20} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <hr className="my-1" />
                    <a
                      href="#"
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // -----------------------
  // Improved Hero Section Component
  // -----------------------
  const Hero = () => {
    return (
      <section
        className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-[80vh] mt-16"
        style={{
          backgroundImage: 'url(https://ideogram.ai/assets/progressive-image/balanced/response/qe-s4-5hQBGsijsMm3xLaw)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Content */}
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Live Coding Challenges
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Code, Collaborate, Conquer: Level Up Your Skills with Real-Time Challenges
          </p>
          <div>
            <button className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white px-8 py-3 rounded-full font-bold mr-4 transition-all duration-300">
              Join Now
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-blue-500 transition-all duration-300">
              View Challenges
            </button>
          </div>
        </div>
      </section>
    );
  };

  // -----------------------
  // Filter & Search Panel
  // -----------------------
  const FilterPanel = ({ filter, setFilter }) => {
    return (
      <div className="bg-gray-100 p-4 flex flex-col md:flex-row items-center justify-between">
        <input
          type="text"
          placeholder="Search challenges..."
          className="p-2 border border-gray-300 rounded mb-2 md:mb-0"
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <div className="flex space-x-2">
          <select
            className="p-2 border border-gray-300 rounded"
            value={filter.difficulty || ''}
            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded"
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Live">Live</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    );
  };

  // -----------------------
  // Challenge Card Component
  // -----------------------
  const ChallengeCard = ({ challenge, onSelect }) => {
    return (
      <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition duration-200">
        <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
        <p className="mb-2">{challenge.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{challenge.difficulty}</span>
          <span
            className={`text-sm font-semibold ${
              challenge.status === 'Live'
                ? 'text-green-600'
                : challenge.status === 'Upcoming'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            {challenge.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Time Left: {challenge.countdown}</span>
          <button
            onClick={() => onSelect(challenge)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded hover:from-blue-600 hover:to-purple-600"
          >
            Join
          </button>
        </div>
      </div>
    );
  };

  // -----------------------
  // Challenge List Component
  // -----------------------
  const ChallengeList = ({ challenges, onSelect }) => {
    return (
      <section className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} onSelect={onSelect} />
        ))}
      </section>
    );
  };

  // -----------------------
  // Live Coding Editor Component
  // -----------------------
  const LiveCodingEditor = () => {
    const [code, setCode] = useState('// Write your code here\n');
    const [output, setOutput] = useState('');

    const runCode = () => {
      // NOTE: In production, run the code safely (e.g. in a sandboxed environment or backend)
      setOutput("Code executed! (Output simulated)");
    };

    return (
      <div className="bg-gray-100 p-4 rounded mt-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 font-mono"
          rows="8"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={runCode}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-purple-600"
        >
          Run Code
        </button>
        {output && (
          <pre className="mt-4 p-2 bg-black text-green-400 rounded">{output}</pre>
        )}
      </div>
    );
  };

  // -----------------------
  // Challenge Detail Modal Component
  // -----------------------
  const ChallengeDetailModal = ({ challenge, onClose }) => {
    if (!challenge) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">{challenge.title}</h2>
          <p className="mb-4">{challenge.fullDescription}</p>
          <div className="mb-4">
            <strong>Status:</strong> {challenge.status} &nbsp;
            <strong>Difficulty:</strong> {challenge.difficulty} &nbsp;
            <strong>Time Left:</strong> {challenge.countdown}
          </div>
          <LiveCodingEditor />
        </div>
      </div>
    );
  };

  // -----------------------
  // Enhanced Leaderboard Component
  // -----------------------
  const Leaderboard = () => {
    // Sample leaderboard data
    const sampleLeaderboard = [
      { id: 1, name: 'Alice', score: 95 },
      { id: 2, name: 'Bob', score: 90 },
      { id: 3, name: 'Charlie', score: 85 },
    ];

    return (
      <section className="p-4 mx-4">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-gradient-to-r from-blue-500 to-purple-500">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-gradient-to-r from-blue-500 to-purple-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-gradient-to-r from-blue-500 to-purple-500">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleLeaderboard.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  // -----------------------
  // Community Chat Component
  // -----------------------
  const CommunityChat = () => {
    const [messages, setMessages] = useState([
      { id: 1, user: 'Alice', text: 'Hello, excited for the challenge!' },
      { id: 2, user: 'Bob', text: 'Me too! Good luck everyone.' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
  
    const sendMessage = () => {
      if (newMessage.trim()) {
        // Append the new message (for demonstration, user is hardcoded as 'You')
        setMessages([...messages, { id: messages.length + 1, user: 'You', text: newMessage }]);
        setNewMessage('');
      }
    };
  
    // Auto scroll to the latest message when messages update.
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    return (
      <section className="bg-white shadow-lg rounded-lg p-4 mx-4 mt-8">
        {/* Header */}
        <div className="border-b pb-2 mb-4 flex items-center">
          <MessageSquare size={20} className="mr-2 text-blue-500" />
          <h2 className="text-xl font-bold">Community Chat</h2>
        </div>
  
        {/* Chat messages */}
        <div className="h-60 overflow-y-auto space-y-4 p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.user === 'You'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs mt-1 text-right opacity-75">
                  {msg.user} • {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Input area */}
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-r-lg hover:from-blue-600 hover:to-purple-600"
          >
            Send
          </button>
        </div>
      </section>
    );
  };
  
  // -----------------------
  // Main State & Data
  // -----------------------
  const [filter, setFilter] = useState({ search: '', difficulty: '', status: '' });
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Sample challenges data
  const allChallenges = [
    {
      id: 1,
      title: 'Build a To-Do App',
      description: 'Create a simple to-do app using React.',
      fullDescription: 'Full details for building a To-Do App including requirements and constraints...',
      difficulty: 'Beginner',
      status: 'Live',
      countdown: '00:15:30',
    },
    {
      id: 2,
      title: 'API Integration Challenge',
      description: 'Integrate a third-party API into your app.',
      fullDescription: 'Full details for API Integration Challenge including documentation links...',
      difficulty: 'Intermediate',
      status: 'Upcoming',
      countdown: '01:20:00',
    },
    {
      id: 3,
      title: 'Real-Time Chat App',
      description: 'Develop a chat application with real-time capabilities.',
      fullDescription:
        'Full details for building a Real-Time Chat App including web sockets, authentication, and UI design...',
      difficulty: 'Advanced',
      status: 'Completed',
      countdown: '00:00:00',
    },
  ];

  // Simple filtering logic
  const filteredChallenges = allChallenges.filter((challenge) => {
    const matchesSearch = filter.search
      ? challenge.title.toLowerCase().includes(filter.search.toLowerCase())
      : true;
    const matchesDifficulty = filter.difficulty ? challenge.difficulty === filter.difficulty : true;
    const matchesStatus = filter.status ? challenge.status === filter.status : true;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  // -----------------------
  // Main Render
  // -----------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FilterPanel filter={filter} setFilter={setFilter} />
      <ChallengeList challenges={filteredChallenges} onSelect={setSelectedChallenge} />
      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
      <Leaderboard />
      <CommunityChat />
    </div>
  );
}
