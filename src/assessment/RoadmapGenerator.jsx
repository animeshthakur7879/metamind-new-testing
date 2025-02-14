import React, { useState, useEffect } from "react";

const RoadmapGenerator = () => {
  const [candidate, setCandidate] = useState({ name: "Loading...", domain: "Loading..." });
  const [duration, setDuration] = useState("1");
  const [courseType, setCourseType] = useState("both");
  const [instructions, setInstructions] = useState("");
  const [roadmap, setRoadmap] = useState(null);

  const apiUrl = "http://localhost:3000";
  const candidateId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (!candidateId) {
      alert("Candidate ID is missing. Redirecting to the main page.");
      window.location.href = "/";
    }
    fetchCandidateInfo();
  }, []);

  const fetchCandidateInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/results/${encodeURIComponent(candidateId)}`);
      if (!response.ok) throw new Error("Failed to fetch candidate info.");
      const result = await response.json();
      setCandidate({ name: result.candidate_name, domain: result.domain });
    } catch (error) {
      console.error("Error fetching candidate info:", error);
    }
  };

  const generateRoadmap = async () => {
    const payload = { candidateId, duration, courseType, customInstructions: instructions };
    try {
      const response = await fetch(`${apiUrl}/generate-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to generate roadmap.");
      const roadmapData = await response.json();
      setRoadmap(roadmapData);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center">Generate Your Personalized Roadmap</h1>
      <p>Name: {candidate.name}</p>
      <p>Domain: {candidate.domain}</p>
      
      <label className="block mt-4">Select Roadmap Duration:</label>
      <select className="w-full p-2 bg-gray-800 text-white" value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option value="1">1 Month</option>
        <option value="2">2 Months</option>
        <option value="3">3 Months</option>
        <option value="6">6 Months</option>
      </select>
      
      <label className="block mt-4">Select Course Type:</label>
      <select className="w-full p-2 bg-gray-800 text-white" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
        <option value="both">Both Free and Paid</option>
        <option value="free">Free Courses Only</option>
        <option value="paid">Paid Courses Only</option>
      </select>
      
      <label className="block mt-4">Additional Instructions (optional):</label>
      <textarea className="w-full p-2 bg-gray-800 text-white" rows="4" value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
      
      <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white" onClick={generateRoadmap}>Generate Roadmap</button>
      
      {roadmap && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Roadmap</h2>
          <div className="bg-gray-800 p-4 rounded mt-2">{roadmap.plainRoadmap}</div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
