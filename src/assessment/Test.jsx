// src/components/Test.jsx
import React, { useState } from 'react';
import { ArrowLeft, Bell, User, Menu } from 'react-feather';

const Test = () => {
  const [candidateName, setCandidateName] = useState('');
  const [domain, setDomain] = useState('');
  const [showUserForm, setShowUserForm] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showTestContainer, setShowTestContainer] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({
    phase1: [],
    phase2: [],
    phase3: []
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const apiUrl = 'http://localhost:3001';

  // Handle form submission for candidate details.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!candidateName || !domain) {
      alert('Please provide both your name and domain.');
      return;
    }
    setShowUserForm(false);
    setShowTerms(true);
  };

  // When terms are accepted, fetch test questions.
  const handleAcceptTerms = () => {
    setShowTerms(false);
    setShowTestContainer(true);
    fetchTest();
  };

  // Fetch test data from the backend.
  const fetchTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/generate-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }
      const data = await response.json();
      // Fallback for Phase 3 if no questions are provided.
      if (!data.phase3 || data.phase3.length === 0) {
        data.phase3 = Array.from({ length: 10 }, (_, i) => ({
          question: `Fallback: Domain-specific question ${i + 1} for ${domain}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 'Option A'
        }));
      }
      setTestData(data);
      // Simulate a 10-second loading delay.
      setTimeout(() => {
        setLoading(false);
      }, 10000);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Render questions for the current phase.
  const renderQuestions = () => {
    if (!testData) return null;
    const phaseKey = `phase${currentPhase}`;
    const questions = testData[phaseKey];
    if (!questions || questions.length === 0) {
      return <p className="text-lg text-gray-700">Test Completed!</p>;
    }
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Phase {currentPhase}:{' '}
          {currentPhase === 1 ? 'Aptitude' : currentPhase === 2 ? 'Verbal' : 'Domain-Specific'}
        </h1>
        <div id="questions-container">
          {questions.map((questionData, index) => (
            <div key={index} className="mb-6 p-4 border-b border-gray-200">
              <p className="text-gray-800 font-medium mb-2">
                {index + 1}. {questionData.question}
              </p>
              {questionData.options.map((option, idx) => (
                <label key={idx} className="block text-gray-700 my-1">
                  <input type="radio" name={`question-${index}`} value={option} className="mr-2" />
                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNextPhase}
            className="relative inline-flex items-center px-8 py-3 rounded-lg focus:outline-none group transform transition-all hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></span>
            <span className="relative inline-flex items-center px-4 py-2 bg-white rounded-lg text-green-600 font-semibold group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
              Next Phase
            </span>
          </button>
          {currentPhase >= 3 && (
            <button
              onClick={handleSubmitTest}
              className="relative inline-flex items-center px-8 py-3 rounded-lg focus:outline-none group transform transition-all hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></span>
              <span className="relative inline-flex items-center px-4 py-2 bg-white rounded-lg text-purple-600 font-semibold group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                Submit Test
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Proceed to the next phase.
  const handleNextPhase = () => {
    // (Collect answers here as needed.)
    setCurrentPhase((prev) => prev + 1);
  };

  // Submit the test answers to the backend.
  const handleSubmitTest = async () => {
    // (Collect final answers as needed.)
    const payload = {
      candidateName,
      domain,
      examQuestions: testData,
      examAnswers: userAnswers
    };
    try {
      const response = await fetch(`${apiUrl}/evaluate-exam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to evaluate test');
      }
      const result = await response.json();
      window.location.href = `results?id=${result.id}`;
    } catch (error) {
      console.error('Error during evaluation:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
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
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Home
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Courses
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Community
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Resources
              </a>
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
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Help Center
                    </a>
                    <hr className="my-1" />
                    <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
                      Sign Out
                    </a>
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

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        @keyframes blob {
          0% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -30px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      {/* Main Content with Decorative Background */}
      <div className="relative pt-20 min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-purple-50 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 w-full max-w-3xl space-y-8">
          {/* User Details Form */}
          {showUserForm && (
            <div
              id="user-details-form"
              className="bg-white shadow-lg rounded-lg p-6 mx-auto animate-fadeIn"
            >
              <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Welcome to the Assessment
              </h1>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="candidate-name" className="block text-gray-700 mb-1">
                    Enter your name:
                  </label>
                  <input
                    type="text"
                    id="candidate-name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="domain" className="block text-gray-700 mb-1">
                    Enter your domain:
                  </label>
                  <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., Software Engineering, Data Science, etc."
                    required
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="relative inline-flex items-center w-full px-6 py-3 rounded-lg focus:outline-none group transform transition-all hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></span>
                  <span className="relative inline-flex items-center justify-center w-full px-4 py-2 bg-white rounded-lg text-blue-600 font-semibold group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                    Start Test
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Terms & Conditions */}
          {showTerms && (
            <div
              id="terms-container"
              className="bg-white shadow-lg rounded-lg p-6 mx-auto animate-fadeIn"
            >
              <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Terms & Conditions
              </h2>
              <p className="text-gray-700 mb-4">
                Please read the following terms and conditions carefully before starting the test.
              </p>
              <p className="text-gray-700 mb-4">
                1. You agree to answer all questions to the best of your ability.<br />
                2. Cheating or using unauthorized materials is strictly prohibited.<br />
                3. Your results will be evaluated accurately and used for assessment purposes.<br />
                4. By clicking "I Accept," you agree to these terms.
              </p>
              <button
                onClick={handleAcceptTerms}
                className="relative inline-flex items-center w-full px-6 py-3 rounded-lg focus:outline-none group transform transition-all hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></span>
                <span className="relative inline-flex items-center justify-center w-full px-4 py-2 bg-white rounded-lg text-blue-600 font-semibold group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                  I Accept
                </span>
              </button>
            </div>
          )}

          {/* Test Container */}
          {showTestContainer && (
            <div
              id="test-container"
              className="bg-white shadow-lg rounded-lg p-6 mx-auto animate-fadeIn"
            >
              {loading ? (
                <div
                  id="loading-container"
                  className="flex flex-col items-center justify-center py-10"
                >
                  <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-700">
                    Loading questions, please wait (expected time: 10 seconds)...
                  </p>
                </div>
              ) : (
                renderQuestions()
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Test;
