import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const [issue, setIssue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate()
  const sendRequest = () => {
    if (issue.trim()) {
      setShowPopup(true);
      setIssue('');
    } else {
      alert("Please describe the issue before submitting.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-blue-900 text-gray-900 font-sans relative">
      {/* Optional Background Overlay */}
      <div className="absolute inset-0 opacity-50 z-0 bg-black"></div>

      <div className="relative z-10 w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full md:w-2/3 p-10 mt-12 max-w-xl mx-auto min-h-[500px]">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-black to-blue-900 mr-2"></div>
              <h1 className="text-3xl text-gray-900 font-bold">Contact Us</h1>
            </div>
            <p className="text-gray-700 mb-8">
              Feel free to contact us any time. We will get back to you as soon as we can!
            </p>
            <form>
              <div className="mb-6">
                <label className="block text-gray-800">Describe the Issue</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 h-24"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe your issue..."
                />
              </div>
              <button onClick={() => navigate('/industryhome')} className=" absolute top-5 left-5 px-3 py-2 rounded-lg bg-gradient-to-r from-black to-blue-900 text-white"> ← back</button>
              <button
                type="button"
                onClick={sendRequest}
                className="w-full bg-gradient-to-r from-black to-blue-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-300 font-semibold"
              >
                Request a Meet
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="relative w-full md:w-1/3 flex items-center justify-center">
            <div className="absolute right-0 h-full w-1/4 bg-gradient-to-r from-black to-blue-900"></div>
            <div className="relative bg-gradient-to-tr from-indigo-700 to-blue-400 text-white p-8 w-full md:w-11/12 border border-gray-300">
              <div className="absolute -top-4 -left-4 w-4 h-4 bg-gradient-to-tr from-indigo-700 to-blue-500"></div>
              <h2 className="text-xl font-bold mb-4">Info</h2>
              <div className="mb-4 flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>metamind@gmail.com</span>
              </div>
              <div className="mb-4 flex items-center">
                <i className="fas fa-phone mr-2"></i>
                <span>+91 9179655685</span>
              </div>
              <div className="mb-4 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>Indore-India</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <span>09:00 - 18:00</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gradient-to-tr from-indigo-700 to-blue-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-indigo-700 to-blue-500 text-white p-5 rounded-lg shadow-lg text-center text-lg z-50 border border-gray-300">
          <p>Your meet request has been sent successfully!</p>
          <button
            onClick={closePopup}
            className="mt-5 bg-gradient-to-r from-black to-blue-900 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactForm;