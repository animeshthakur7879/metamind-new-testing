import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitProjectPage = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    industryType: "",
    description: "",
    category: "",
    deliverables: "",
    techStack: "",
    deadline: "",
    budgetRange: "",
    companyName: "",
    website: "",
    contactEmail: "",
    additionalNotes: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/submit-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // Expect JSON response
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        // You might log the response text to see the HTML error page
        const text = await response.text();
        console.error("Response text:", text);
        throw new Error("Project submission failed");
      }
      const data = await response.json();
      console.log("Project submitted with ID:", data.projectId);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  

  // Background arrays for stars and shooting stars
  const stars = Array.from({ length: 100 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3,
  }));

  const shootingStars = Array.from({ length: 5 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    speed: Math.random() * 5 + 3,
  }));

  const handleClick = () => {
    setShowPopup(false)
    navigate('/industryhome')
  }
  

  return (
    <>
      {/* Fixed Background Container */}
      <div className="fixed inset-0 bg-gradient-to-br from-black to-blue-900 bg-fixed">
        {/* Stars */}
        <div className="absolute inset-0 animate-pulse">
          {stars.map((star, index) => (
            <div
              key={index}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {shootingStars.map((star, index) => (
            <div
              key={index}
              className="absolute bg-white w-1 h-1 rounded-full animate-shooting"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDuration: `${star.speed}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute top-6 left-6 z-10">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
            MetaMind
          </div>
        </div>

        {/* Big MetaMind Heading */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-300 opacity-60">
            MetaMind
          </h1>
        </div>

        {/* Subtle Pulse Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
      </div>

      {/* Scrollable Form Content */}
      <div className="relative z-10 overflow-y-auto px-4">
        <div className="bg-gradient-to-br from-gray-900/50 to-blue-600/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-3xl w-full my-12 mx-auto">
          {/* Back Button */}
          <button
            onClick={(e) => navigate('/industrywelcome')}
            className="text-white text-sm font-medium mb-4 hover:underline"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            Submit Your Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <select
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option className="bg-blue-950 text-white" value="">Select Industry</option>
              <option className="bg-blue-950 text-white" value="IT">IT</option>
              <option className="bg-blue-950 text-white" value="Healthcare">Healthcare</option>
              <option className="bg-blue-950 text-white" value="Finance">Finance</option>
              <option className="bg-blue-950 text-white" value="Education">Education</option>
            </select>

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option className="bg-blue-950 text-white" value="">Select Category</option>
              <option className="bg-blue-950 text-white" value="Web App">Web App</option>
              <option className="bg-blue-950 text-white" value="Mobile App">Mobile App</option>
              <option className="bg-blue-950 text-white" value="AI/ML">AI/ML</option>
              <option className="bg-blue-950 text-white" value="Blockchain">Blockchain</option>
            </select>

            <input
              type="text"
              name="deliverables"
              placeholder="Expected Deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="text"
              name="techStack"
              placeholder="Technology Stack (e.g., MERN, Java, Python)"
              value={formData.techStack}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="text"
              name="budgetRange"
              placeholder="Budget Range (if applicable)"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="url"
              name="website"
              placeholder="Company Website (optional)"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <textarea
              name="additionalNotes"
              placeholder="Additional Notes (if any)"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 bg-transparent text-white placeholder-gray-300 border-b border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-all"
            >
              Submit Project
            </button>
          </form>
        </div>
      </div>

      {/* Popup Modal on Submit */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gradient-to-br from-black/70 to-blue-900/70 backdrop-blur-md p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-300">
              Project Submitted
            </h3>
            <p className="mb-6 text-white">
              Your project has been successfully submitted.
            </p>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded hover:scale-105 transition-all"
              onClick={(e) => handleClick() }
              
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitProjectPage;
