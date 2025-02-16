// src/components/Result.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Bell, User, Menu } from 'lucide-react';

const Result = () => {
  const [result, setResult] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('id');
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:3001';

  useEffect(() => {
    if (!candidateId) {
      alert('Candidate ID is missing. Redirecting to the main page.');
      navigate('/');
      return;
    }
    fetch(`${apiUrl}/results/${encodeURIComponent(candidateId)}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch results.');
        return response.json();
      })
      .then((data) => setResult(data))
      .catch((error) => {
        console.error('Error fetching results:', error);
        alert('Error: ' + error.message);
      });
  }, [candidateId, navigate]);

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Test Results', 10, 10);
    pdf.setFontSize(12);
    pdf.text(`Candidate Name: ${result.candidate_name}`, 10, 20);
    pdf.text(`Domain: ${result.domain}`, 10, 30);
    pdf.text(
      `Phase 1 Score: ${result.scores["Phase 1 - Aptitude"]} (Correct: +4, Wrong: -1, Unanswered: 0)`,
      10,
      40
    );
    pdf.text(`Phase 2 Score: ${result.scores["Phase 2 - Verbal"]}`, 10, 50);
    pdf.text(`Phase 3 Score: ${result.scores["Phase 3 - Domain-Specific"]}`, 10, 60);
    pdf.text(`Overall Score: ${result.overall_score}`, 10, 70);
    pdf.text('Feedback:', 10, 90);
    let yPos = 100;
    Object.entries(result.feedback).forEach(([phase, feedback]) => {
      pdf.text(`${phase}: ${feedback}`, 10, yPos);
      yPos += 10;
    });
    pdf.save('Test_Results.pdf');
  };

  // Navbar component (used in both loading & loaded states)
  const Navbar = () => (
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
  );

  if (!result) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-8 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Loading Results...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Custom Fade-In Animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 p-6 pt-24 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 animate-fadeIn">
          Test Results
        </h1>
        <div
          id="result-container"
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl animate-fadeIn"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Candidate Information:
          </h2>
          <p className="text-gray-800 mb-2">
            <span className="font-semibold">Name:</span> {result.candidate_name}
          </p>
          <p className="text-gray-800 mb-4">
            <span className="font-semibold">Domain:</span> {result.domain}
          </p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Scores:</h2>
          <p className="text-gray-800 mb-2">
            <span className="font-semibold">Phase 1 (Aptitude):</span>{' '}
            {result.scores["Phase 1 - Aptitude"]} (Correct: +4, Wrong: -1, Unanswered: 0)
          </p>
          <p className="text-gray-800 mb-2">
            <span className="font-semibold">Phase 2 (Verbal):</span>{' '}
            {result.scores["Phase 2 - Verbal"]}
          </p>
          <p className="text-gray-800 mb-4">
            <span className="font-semibold">Phase 3 (Domain-Specific):</span>{' '}
            {result.scores["Phase 3 - Domain-Specific"]}
          </p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Overall Score:
          </h2>
          <p className="text-gray-800 mb-6 text-xl font-bold">
            {result.overall_score}
          </p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Feedback:</h2>
          <div className="space-y-2">
            {Object.entries(result.feedback).map(([phase, feedback]) => (
              <p key={phase} className="text-gray-800">
                <span className="font-semibold">{phase}:</span> {feedback}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition transform hover:scale-105"
          >
            Download Results as PDF
          </button>
          <button
            onClick={() => navigate(`/roadmap?id=${candidateId}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition transform hover:scale-105"
          >
            Generate Roadmap
          </button>
        </div>
      </div>
    </>
  );
};

export default Result;
