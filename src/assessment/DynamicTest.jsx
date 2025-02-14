import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DynamicTest = () => {
  const apiUrl = "http://localhost:3000"; // Backend API URL
  const navigate = useNavigate();
  const [candidateName, setCandidateName] = useState("");
  const [domain, setDomain] = useState("");
  const [step, setStep] = useState("userDetails");
  const [testData, setTestData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [userAnswers, setUserAnswers] = useState({ phase1: [], phase2: [], phase3: [] });
  const [loading, setLoading] = useState(false);

  const handleStartTest = (e) => {
    e.preventDefault();
    if (!candidateName.trim() || !domain.trim()) {
      alert("Please provide both your name and domain.");
      return;
    }
    setStep("terms");
  };

  const handleAcceptTerms = () => {
    setStep("loading");
    fetchTest();
  };

  const fetchTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/generate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!response.ok) throw new Error("Failed to fetch test data");
      const data = await response.json();
      setTestData(data);
      setTimeout(() => {
        setLoading(false);
        setStep("test");
      }, 10000);
    } catch (error) {
      setLoading(false);
      alert("Error: " + error.message);
    }
  };

  const handleAnswerSelection = (questionIndex, answer) => {
    setUserAnswers((prev) => {
      const phaseKey = `phase${currentPhase}`;
      const updatedAnswers = { ...prev };
      updatedAnswers[phaseKey][questionIndex] = answer;
      return updatedAnswers;
    });
  };

  const handleNextPhase = () => {
    if (currentPhase < 3) {
      setCurrentPhase((prev) => prev + 1);
    } else {
      setStep("completed");
    }
  };

  const handleSubmitTest = async () => {
    try {
      const response = await fetch(`${apiUrl}/evaluate-exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName,
          domain,
          examQuestions: testData,
          examAnswers: userAnswers,
        }),
      });

      if (!response.ok) throw new Error("Failed to evaluate test");
      const result = await response.json();
      if (!result.id) throw new Error("No ID returned from the server.");
      setTimeout(() => {
        navigate(`/result?id=${result.id}`);
      }, 10000);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg text-center">
      {step === "userDetails" && (
        <form onSubmit={handleStartTest}>
          <h1 className="text-2xl font-bold">Welcome to the Assessment</h1>
          <div className="mt-4">
            <label className="block">Enter your name:</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Enter your domain:</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded">
            Start Test
          </button>
        </form>
      )}

      {step === "terms" && (
        <div>
          <h2 className="text-2xl font-bold">Terms & Conditions</h2>
          <p>Please read and accept the terms before starting.</p>
          <ul className="text-left list-disc list-inside mt-2">
            <li>No cheating is allowed.</li>
            <li>Answer all questions honestly.</li>
            <li>Your results will be evaluated fairly.</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-700 rounded" onClick={handleAcceptTerms}>
            I Accept
          </button>
        </div>
      )}

      {step === "loading" && (
        <div>
          <div className="spinner border-t-8 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin mx-auto"></div>
          <p className="mt-4">Loading questions, please wait...</p>
        </div>
      )}

      {step === "test" && testData && (
        <div>
          <h1 className="text-2xl font-bold">
            Phase {currentPhase}: {currentPhase === 1 ? "Aptitude" : currentPhase === 2 ? "Verbal" : "Domain-Specific"}
          </h1>
          <div className="mt-4">
            {testData[`phase${currentPhase}`]?.map((questionData, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg">{index + 1}. {questionData.question}</p>
                {questionData.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerSelection(index, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </div>
          {currentPhase < 3 ? (
            <button className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-700 rounded" onClick={handleNextPhase}>
              Next Phase
            </button>
          ) : (
            <button className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-700 rounded" onClick={handleSubmitTest}>
              Submit Test
            </button>
          )}
        </div>
      )}

      {step === "completed" && (
        <div>
          <h1 className="text-2xl font-bold">Test Completed!</h1>
          <p>Your answers have been submitted. Redirecting to results...</p>
        </div>
      )}
    </div>
  );
};

export default DynamicTest;
