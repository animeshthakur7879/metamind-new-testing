import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function TestResults() {
  const [result, setResult] = useState(null);
  const candidateId = new URLSearchParams(window.location.search).get("id");
  const apiUrl = "http://localhost:3000";

  useEffect(() => {
    if (!candidateId) {
      alert("Candidate ID is missing. Redirecting to the main page.");
      window.location.href = "/";
      return;
    }

    async function fetchResults() {
      try {
        const response = await fetch(`${apiUrl}/results/${encodeURIComponent(candidateId)}`);
        if (!response.ok) throw new Error("Failed to fetch results.");
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching results:", error);
        alert("Error: " + error.message);
      }
    }

    fetchResults();
  }, [candidateId]);

  const generatePDF = () => {
    if (!result) return;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Test Results", 10, 10);
    pdf.setFontSize(12);
    pdf.text(`Candidate Name: ${result.candidate_name}`, 10, 20);
    pdf.text(`Domain: ${result.domain}`, 10, 30);
    pdf.text(`Phase 1 Score: ${result.scores["Phase 1 - Aptitude"]} (Correct: +4, Wrong: -1, Unanswered: 0)`, 10, 40);
    pdf.text(`Phase 2 Score: ${result.scores["Phase 2 - Verbal"]}`, 10, 50);
    pdf.text(`Phase 3 Score: ${result.scores["Phase 3 - Domain-Specific"]}`, 10, 60);
    pdf.text(`Overall Score: ${result.overall_score}`, 10, 70);
    pdf.text("Feedback:", 10, 90);

    Object.entries(result.feedback).forEach(([phase, feedback], index) => {
      pdf.text(`${phase}: ${feedback}`, 10, 100 + index * 10);
    });

    pdf.save("Test_Results.pdf");
  };

  if (!result) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Test Results</h1>
        <p><strong>Name:</strong> {result.candidate_name}</p>
        <p><strong>Domain:</strong> {result.domain}</p>
        <h2 className="text-lg font-semibold mt-4">Scores:</h2>
        <p>Phase 1 (Aptitude): {result.scores["Phase 1 - Aptitude"]} (Correct: +4, Wrong: -1, Unanswered: 0)</p>
        <p>Phase 2 (Verbal): {result.scores["Phase 2 - Verbal"]}</p>
        <p>Phase 3 (Domain-Specific): {result.scores["Phase 3 - Domain-Specific"]}</p>
        <h2 className="text-lg font-semibold mt-4">Overall Score:</h2>
        <p>{result.overall_score}</p>
        <h2 className="text-lg font-semibold mt-4">Feedback:</h2>
        <div>
          {Object.entries(result.feedback).map(([phase, feedback]) => (
            <p key={phase}><strong>{phase}:</strong> {feedback}</p>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={generatePDF} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
            Download Results as PDF
          </button>
          <button onClick={() => window.location.href = `/roadmapgenerator?id=${candidateId}`} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition">
            Generate Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}