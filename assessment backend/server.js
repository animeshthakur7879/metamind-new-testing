import express from "express";
import cors from "cors";
import mysql from "mysql2";
import PDFDocument from "pdfkit";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
app.use(express.json());
app.use(cors());

// Use separate API keys for each phase – replace these with your valid keys.
const API_KEY_PHASE1 = "AIzaSyBhrWWpPP_mEk8pvGxIq8PobhHsiKCUdOg";
const API_KEY_PHASE2 = "AIzaSyBoyP7hnrs5bDaxc1yRmNSrwawii5Y8YeE";
const API_KEY_PHASE3 = "AIzaSyCjBQihIrbgqyIuKz4YoB_OfMtBelB-xus";

const genAIAptitude = new GoogleGenerativeAI(API_KEY_PHASE1);
const genAIVerbal   = new GoogleGenerativeAI(API_KEY_PHASE2);
const genAIDomain   = new GoogleGenerativeAI(API_KEY_PHASE3);
const port = 3001;
// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your DB username
  password: "root", // Replace with your DB password
  database: "assessment_db", // Replace with your DB name
  port : 5000
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to assessment database.");
});

// Serve static files directly from the root directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/**
 * Helper function to balance brackets in a JSON string.
 */
function balanceBrackets(text) {
  const openCurly = (text.match(/{/g) || []).length;
  const closeCurly = (text.match(/}/g) || []).length;
  const openSquare = (text.match(/\[/g) || []).length;
  const closeSquare = (text.match(/]/g) || []).length;
  let newText = text;
  // Append missing closing square brackets first
  for (let i = 0; i < openSquare - closeSquare; i++) {
    newText += "]";
  }
  // Then append missing closing curly braces
  for (let i = 0; i < openCurly - closeCurly; i++) {
    newText += "}";
  }
  return newText;
}

/**
 * Enhanced function to repair common JSON issues.
 */
function repairJSON(text) {
  let newText = text;
  
  // 1. Remove code fences (e.g., ```json or ```)
  newText = newText.replace(/```(json)?/gi, "").replace(/```/gi, "").trim();
  
  // 2. Remove ellipses and control characters; replace newlines with a space
  newText = newText.replace(/\.\.\./g, "")
                   .replace(/[\u0000-\u001F]+/g, " ")
                   .replace(/\r?\n/g, " ");
  
  // 3. Remove trailing commas before } or ]
  newText = newText.replace(/,\s*([\]}])/g, "$1")
                   .replace(/,\s*\]/g, "]");
  
  // 4. Insert missing quotes for unquoted property names.
  newText = newText.replace(/([{,]\s*)([A-Za-z0-9_]+)(\s*:)/g, '$1"$2"$3');
  
  // 5. Insert missing commas between adjacent quoted strings if needed
  newText = newText.replace(/"(\s*)"(?=")/g, '", "')
                   .replace(/"(\s*)"(?=\w+":)/g, '", ');
  
  // 6. Extract the JSON block (from the first "{" to the last "}")
  const firstBrace = newText.indexOf("{");
  const lastBrace = newText.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    newText = newText.substring(firstBrace, lastBrace + 1);
  }
  
  // 7. Balance quotes and braces before further processing.
  newText = balanceBrackets(newText);
  
  // 8. Aggressively fix parsing errors
  let maxTries = 100;
  while (maxTries-- > 0) {
    try {
      JSON.parse(newText);
      break; // Successfully parsed
    } catch (err) {
      const errMsg = err.message;
      if (errMsg.includes("Unterminated string") || errMsg.includes("Unexpected end of JSON input")) {
        newText += '"';
      } else if (errMsg.includes("Expected ',' or ']'")) {
        newText = newText.slice(0, -1);
      } else if (errMsg.includes("Expected double-quoted property name")) {
        newText = newText.replace(/([{,]\s*)([A-Za-z0-9_]+)(\s*:)/g, '$1"$2"$3');
      } else {
        newText = newText.slice(0, -1);
      }
      newText = balanceBrackets(newText);
    }
  }
  
  // 9. Final balancing pass.
  newText = balanceBrackets(newText);
  return newText;
}

/* ------------------ GENERATION FUNCTIONS ------------------ */

// Generate Phase 1: Aptitude Questions
async function generatePhase1(domain) {
  try {
    const model = genAIAptitude.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
Create a very challenging and tough MCQ-based test for candidates applying in the "${domain}" domain.
The test must include exactly the following key in the output JSON:
  
"phase1": Generate exactly 10 very challenging Aptitude Questions.
   Each question object must contain:
    - "question": a string,
    - "options": an array of exactly 4 options,
    - "correct": the correct option.
  
IMPORTANT: Output the result as pure JSON with no additional text, no ellipses, and no extra commas.
The JSON object must have exactly the key "phase1" with the required number of question objects.
    `;
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = repairJSON(responseText);
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Phase 1 JSON parse failed:", parseError.message);
      console.error("Repaired Phase 1 JSON text:", responseText);
      parsed = { phase1: [] };
    }
    return parsed.phase1;
  } catch (error) {
    console.error("Error generating Phase 1:", error.message || error);
    return [];
  }
}

// Generate Phase 2: Verbal Questions
async function generatePhase2(domain) {
  try {
    const model = genAIVerbal.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
Create a very challenging and tough MCQ-based test for candidates applying in the "${domain}" domain.
The test must include exactly the following key in the output JSON:
  
"phase2": Generate exactly 10 strictly verbal questions (reading comprehension, grammar, vocabulary) with NO domain-specific content.
   Each question object must contain:
    - "question": a string,
    - "options": an array of exactly 4 options,
    - "correct": the correct option.
  
IMPORTANT: Output the result as pure JSON with no additional text, no ellipses, and no extra commas.
The JSON object must have exactly the key "phase2" with the required number of question objects.
    `;
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = repairJSON(responseText);
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Phase 2 JSON parse failed:", parseError.message);
      console.error("Repaired Phase 2 JSON text:", responseText);
      parsed = { phase2: [] };
    }
    return parsed.phase2;
  } catch (error) {
    console.error("Error generating Phase 2:", error.message || error);
    return [];
  }
}

// Generate Phase 3: Domain-Specific Questions
async function generatePhase3(domain) {
  try {
    const model = genAIDomain.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
Create a very challenging and tough MCQ-based test of industry level questions for candidates applying in the "${domain}" domain.
The test must include exactly the following key in the output JSON:
  
"phase3": Generate exactly 10 original, challenging, and domain-specific questions for the "${domain}" domain.
   Each question object must contain:
    - "question": a string,
    - "options": an array of exactly 4 options,
    - "correct": the correct option.
  
IMPORTANT: Output the result as pure JSON with no additional text, no ellipses, and no extra commas.
The JSON object must have exactly the key "phase3" with 10 question objects.
    `;
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = repairJSON(responseText);
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Phase 3 JSON parse failed:", parseError.message);
      console.error("Repaired Phase 3 JSON text:", responseText);
      parsed = { phase3: [] };
    }
    return parsed.phase3;
  } catch (error) {
    console.error("Error generating Phase 3:", error.message || error);
    return [];
  }
}

// Combined function to generate the complete test
async function generateTest(domain) {
  const phase1Questions = await generatePhase1(domain);
  const phase2Questions = await generatePhase2(domain);
  let phase3Questions = await generatePhase3(domain);
  // Fallback if Phase 3 does not have exactly 10 questions
  if (!phase3Questions || phase3Questions.length !== 10) {
    phase3Questions = getFallbackDomainQuestions(domain);
  }
  return { phase1: phase1Questions, phase2: phase2Questions, phase3: phase3Questions };
}

app.post("/generate-assessment", async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: "Domain is required." });
  }
  try {
    const test = await generateTest(domain);
    res.json(test);
  } catch (error) {
    console.error("Error handling /generate-assessment request:", error.message || error);
    res.status(500).json({ error: "An unexpected error occurred while generating the test." });
  }
});

// Fallback function to generate dummy domain-specific questions for Phase 3
function getFallbackDomainQuestions(domain) {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({
      question: `Fallback: Domain-specific question ${i} for ${domain}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: "Option A"
    });
  }
  return questions;
}

/**
 * POST /evaluate-exam
 * Evaluates the candidate's test using AI for highly accurate marking and saves results to the database.
 */
app.post("/evaluate-exam", async (req, res) => {
  const { examQuestions, examAnswers, candidateName, domain } = req.body;
  if (!examQuestions || !examAnswers || !candidateName || !domain) {
    return res.status(400).json({
      error: "Exam questions, answers, candidate name, and domain are required.",
    });
  }
  try {
    // Construct the evaluation prompt for Gemini AI:
    const evalPrompt = `
A candidate named "${candidateName}" has completed an exam for the "${domain}" domain.
The exam contained the following questions and the candidate provided the following answers.
Questions:
${JSON.stringify(examQuestions, null, 2)}
Candidate Answers:
${JSON.stringify(examAnswers, null, 2)}
Using the scoring rules: +4 marks for each correct answer, -1 mark for each wrong answer, and 0 marks for unanswered questions,
and performing case-insensitive comparisons for correctness,
carefully evaluate the candidate's performance for each phase ("Phase 1 - Aptitude", "Phase 2 - Verbal", "Phase 3 - Domain-Specific").
Provide detailed, step-by-step feedback for each phase and calculate an overall score out of 100.
Return the evaluation as valid JSON in the following format:
{
  "scores": {
    "Phase 1 - Aptitude": <number>,
    "Phase 2 - Verbal": <number>,
    "Phase 3 - Domain-Specific": <number>
  },
  "overall_score": <number>,
  "feedback": {
    "Phase 1 - Aptitude": "<feedback text>",
    "Phase 2 - Verbal": "<feedback text>",
    "Phase 3 - Domain-Specific": "<feedback text>"
  }
}
    `;
    const model = genAIDomain.getGenerativeModel({ model: "gemini-pro" });
    const evalResult = await model.generateContent(evalPrompt);
    let evalResponseText = evalResult.response.text();
    evalResponseText = repairJSON(evalResponseText);
    let evaluation;
    try {
      evaluation = JSON.parse(evalResponseText);
    } catch (parseError) {
      console.error("AI Evaluation JSON parse failed:", parseError.message);
      console.error("Repaired Evaluation JSON text:", evalResponseText);
      // Fallback to manual evaluation if AI evaluation fails
      const correctAnswerPoints = 4;
      const wrongAnswerPenalty = -1;
      const phaseScores = {
        "Phase 1 - Aptitude": 0,
        "Phase 2 - Verbal": 0,
        "Phase 3 - Domain-Specific": 0
      };
      ["phase1", "phase2", "phase3"].forEach((phaseKey) => {
        if (Array.isArray(examQuestions[phaseKey])) {
          examQuestions[phaseKey].forEach((q, i) => {
            const userAnswer = examAnswers[phaseKey] ? examAnswers[phaseKey][i] : "";
            if (q.correct && userAnswer.trim().toLowerCase() === q.correct.trim().toLowerCase()) {
              if (phaseKey === "phase1") phaseScores["Phase 1 - Aptitude"] += correctAnswerPoints;
              else if (phaseKey === "phase2") phaseScores["Phase 2 - Verbal"] += correctAnswerPoints;
              else if (phaseKey === "phase3") phaseScores["Phase 3 - Domain-Specific"] += correctAnswerPoints;
            } else if (userAnswer) {
              if (phaseKey === "phase1") phaseScores["Phase 1 - Aptitude"] += wrongAnswerPenalty;
              else if (phaseKey === "phase2") phaseScores["Phase 2 - Verbal"] += wrongAnswerPenalty;
              else if (phaseKey === "phase3") phaseScores["Phase 3 - Domain-Specific"] += wrongAnswerPenalty;
            }
          });
        }
      });
      // Maximum possible marks: 10 questions x 4 marks per phase = 40 marks per phase; total maximum = 120.
      const totalMarksObtained = phaseScores["Phase 1 - Aptitude"] + phaseScores["Phase 2 - Verbal"] + phaseScores["Phase 3 - Domain-Specific"];
      const overallScore = Math.max(0, (totalMarksObtained / 120) * 100);
      evaluation = {
        scores: phaseScores,
        overall_score: overallScore,
        feedback: {
          "Phase 1 - Aptitude": phaseScores["Phase 1 - Aptitude"] >= 30 ? "Excellent Aptitude Skills" : "Needs Improvement in Logical Thinking",
          "Phase 2 - Verbal": phaseScores["Phase 2 - Verbal"] >= 30 ? "Strong Command over Language" : "Work on Grammar and Comprehension",
          "Phase 3 - Domain-Specific": phaseScores["Phase 3 - Domain-Specific"] >= 30 ? "Strong Domain-Specific Knowledge" : "Needs Better Domain Understanding"
        }
      };
    }
    
    // Save the evaluation result in the database
    const query = `
      INSERT INTO results (candidate_name, domain, scores, overall_score, feedback)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      candidateName,
      domain,
      JSON.stringify(evaluation.scores),
      evaluation.overall_score,
      JSON.stringify(evaluation.feedback)
    ];
    db.query(query, values, (err, dbResult) => {
      if (err) {
        console.error("Error saving results to the database:", err);
        return res.status(500).json({ error: "Failed to save results to the database." });
      }
      console.log("Results saved to database with ID:", dbResult.insertId);
      res.json({ id: dbResult.insertId });
    });
  } catch (error) {
    console.error("Error evaluating test:", error.message || error);
    res.status(500).json({ error: "Failed to evaluate test." });
  }
});

/**
 * GET /results/:id
 * Fetches the candidate's test results by ID
 */
app.get("/results/:id", (req, res) => {
  const { id } = req.params;
  console.log("Fetching results for candidate ID:", id);
  if (!id) {
    return res.status(400).json({ error: "Candidate ID is missing." });
  }
  const query = `SELECT * FROM results WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching results from database:", err);
      return res.status(500).json({ error: "Failed to fetch results from the database." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No results found for the candidate." });
    }
    const result = results[0];
    result.scores = JSON.parse(result.scores);
    result.feedback = JSON.parse(result.feedback);
    res.json(result);
  });
});

/**
 * GET /download-results/:candidateName
 * Generates and downloads a PDF for the given candidate's test results
 */
app.get("/download-results/:candidateName", (req, res) => {
  const { candidateName } = req.params;
  const query = `
    SELECT * FROM results
    WHERE candidate_name = ?
    ORDER BY created_at DESC
    LIMIT 1
  `;
  db.query(query, [candidateName], (err, results) => {
    if (err) {
      console.error("Error fetching results from database:", err);
      return res.status(500).json({ error: "Failed to fetch results from the database." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No results found for the candidate." });
    }
    const result = results[0];
    const pdfDoc = new PDFDocument();
    const pdfPath = path.join(__dirname, `${candidateName}-Test-Results.pdf`);
    pdfDoc.pipe(fs.createWriteStream(pdfPath));
    pdfDoc.fontSize(16).text(`Test Results for ${candidateName}`, { align: "center" });
    pdfDoc.moveDown();
    pdfDoc.fontSize(12).text(`Domain: ${result.domain}`);
    pdfDoc.text(`Overall Score: ${result.overall_score}`);
    pdfDoc.text("Scores:");
    const scores = JSON.parse(result.scores);
    Object.entries(scores).forEach(([phase, score]) => {
      pdfDoc.text(`  - ${phase}: ${score}`);
    });
    pdfDoc.text("Feedback:");
    const feedback = JSON.parse(result.feedback);
    Object.entries(feedback).forEach(([phase, fb]) => {
      pdfDoc.text(`  - ${phase}: ${fb}`);
    });
    pdfDoc.end();
    res.download(pdfPath, `${candidateName}-Test-Results.pdf`, (err) => {
      if (err) {
        console.error("Error downloading PDF:", err);
      }
      fs.unlinkSync(pdfPath);
    });
  });
});


/**
 * POST /generate-roadmap
 * Generates a personalized, industry-focused roadmap for a candidate using a developer-supplied Gemini API key.
 *
 * Expected payload (JSON):
 * {
 *   "candidateId": "<candidate id from the results table>",
 *   "duration": "<duration in months, e.g., 1, 2, 3, etc.>",
 *   "courseType": "<'free', 'paid', or 'both'>",
 *   "customInstructions": "<optional additional instructions>"
 * }
 *
 * The endpoint fetches the candidate's test result, builds a detailed prompt incorporating
 * the candidate’s information, the requested roadmap duration, the course type filter, and any
 * additional instructions; then uses the Gemini AI model (with the developer-supplied API key) to generate and return a personalized roadmap.
 */
// Updated helper function to remove code fences and problematic newlines.
// Helper function to clean up JSON text
// Updated helper function to remove code fences and problematic newlines.
// Updated helper function to remove code fences and problematic newlines.
function extractValidJSON(text) {
    // Remove code fences like ```json and ```
    let cleaned = text.replace(/```(json)?/gi, "").replace(/```/gi, "").trim();
    // Replace newline characters with a space
    cleaned = cleaned.replace(/\r?\n/g, " ");
    
    const firstBraceIndex = cleaned.indexOf("{");
    if (firstBraceIndex === -1) return "";
    
    let braceCount = 0;
    let endIndex = -1;
    for (let i = firstBraceIndex; i < cleaned.length; i++) {
      if (cleaned[i] === '{') {
        braceCount++;
      } else if (cleaned[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    
    let extracted = "";
    if (endIndex !== -1) {
      extracted = cleaned.substring(firstBraceIndex, endIndex + 1);
    } else {
      // If no balanced substring is found, take from the first "{" to the end
      extracted = cleaned.substring(firstBraceIndex);
      // Append missing closing braces
      const openBraces = (extracted.match(/{/g) || []).length;
      const closedBraces = (extracted.match(/}/g) || []).length;
      const missing = openBraces - closedBraces;
      if (missing > 0) {
        extracted += "}".repeat(missing);
      }
    }
    return extracted;
  }
  
  /**
   * Attempts to parse JSON text. If an "Unterminated string" error is caught,
   * it appends a closing quote and/or additional closing braces as a fallback.
   * Also cleans up stray newline escapes.
   */
  function parseJSONWithFallback(text) {
    // Replace occurrences of stray newline escapes (e.g. "\n\ " becomes "\n")
    text = text.replace(/\\n\\\s*/g, "\\n");
    try {
      return JSON.parse(text);
    } catch (error) {
      console.warn("Initial JSON parse failed:", error, "Original text:", text);
      if (error.message.includes("Unterminated string")) {
        let fixed = text;
        const quoteCount = (fixed.match(/(?<!\\)"/g) || []).length;
        if (quoteCount % 2 !== 0) fixed += '"';
        const openBraces = (fixed.match(/{/g) || []).length;
        const closedBraces = (fixed.match(/}/g) || []).length;
        if (openBraces > closedBraces) fixed += "}".repeat(openBraces - closedBraces);
        console.log("Attempting to parse fixed text:", fixed);
        return JSON.parse(fixed);
      } else {
        throw error;
      }
    }
  }
  
  // Endpoint to generate roadmap using Gemini AI
  app.post("/generate-roadmap", async (req, res) => {
    const { candidateId, duration, courseType, customInstructions } = req.body;
    if (!candidateId || !duration) {
      return res.status(400).json({ error: "Candidate ID and duration are required." });
    }
    
    try {
      // Fetch candidate's test result from the database using candidateId
      const query = "SELECT * FROM results WHERE id = ?";
      db.query(query, [candidateId], async (err, results) => {
        if (err) {
          console.error("Error fetching candidate result:", err);
          return res.status(500).json({ error: "Failed to fetch candidate result." });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "No result found for the candidate." });
        }
        
        const candidateResult = results[0];
        let candidateData;
        try {
          candidateData = {
            candidateName: candidateResult.candidate_name,
            domain: candidateResult.domain,
            scores: JSON.parse(candidateResult.scores),
            overallScore: candidateResult.overall_score,
            feedback: JSON.parse(candidateResult.feedback)
          };
        } catch (parseError) {
          console.error("Error parsing candidate result JSON:", parseError);
          candidateData = {
            candidateName: candidateResult.candidate_name,
            domain: candidateResult.domain,
            scores: {},
            overallScore: candidateResult.overall_score,
            feedback: {}
          };
        }
        
        // Use the developer-supplied Gemini API key (replace with your actual key)
        const DEVELOPER_GEMINI_API_KEY = "AIzaSyCjBQihIrbgqyIuKz4YoB_OfMtBelB-xus";
        const roadmapGenAI = new GoogleGenerativeAI(DEVELOPER_GEMINI_API_KEY);
        const model = roadmapGenAI.getGenerativeModel({ model: "gemini-pro" });
        
        let courseTypeInstruction = "";
        if (courseType && courseType.toLowerCase() === "free") {
          courseTypeInstruction = "Focus on free online courses with detailed descriptions and clickable links.";
        } else if (courseType && courseType.toLowerCase() === "paid") {
          courseTypeInstruction = "Include paid courses, certifications, and in-depth training programs.";
        } else {
          courseTypeInstruction = "Combine both free and paid courses with clickable links.";
        }
        
        let additionalInstructions = "";
        if (customInstructions && customInstructions.trim() !== "") {
          additionalInstructions = `Additional notes: ${customInstructions.trim()}`;
        }
        
        // Build the detailed prompt using a template literal.
        const prompt = `
  Generate a detailed, bullet-point, week-by-week roadmap for the candidate to excel in the "${candidateData.domain}" domain.
  The roadmap should be in valid JSON format with a single key "plainRoadmap" that contains the roadmap as plain text.
  The roadmap must include for each week:
  - A clearly defined objective.
  - Learning topics.
  - Actionable tasks (each task prefixed with a dash and a space).
  - Suggested resources with clickable links.
  - A final assessment or milestone.
  
  Candidate Details:
  - Name: "${candidateData.candidateName}"
  - Domain: "${candidateData.domain}"
  - Overall Score: ${candidateData.overallScore}
  - Scores Breakdown: ${JSON.stringify(candidateData.scores, null, 2)}
  - Feedback: ${JSON.stringify(candidateData.feedback, null, 2)}
  - Roadmap Duration: ${duration} month(s)
  - Course Preference: ${courseType}
  
  ${courseTypeInstruction}
  ${additionalInstructions}
  
  Output only a single valid JSON object with the key "plainRoadmap" and no additional text.
        `;
        
        try {
          const roadmapResult = await model.generateContent(prompt);
          let rawResponseText = roadmapResult.response.text();
          console.log('Raw AI Response:', rawResponseText);
          
          if (!rawResponseText || rawResponseText.trim() === '') {
            return res.status(500).json({ error: "Received an empty response from AI." });
          }
          
          let responseText = extractValidJSON(rawResponseText).trim();
          // Clean up stray newline escapes (e.g., "\n\ " => "\n")
          responseText = responseText.replace(/\\n\\\s*/g, "\\n");
          let parsedOutput;
          try {
            parsedOutput = parseJSONWithFallback(responseText);
          } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
            return res.status(500).json({ error: "AI response was not valid JSON.", raw: responseText });
          }
          
          // Supply a default empty value for formattedRoadmap if not provided.
          const plainRoadmap = parsedOutput.plainRoadmap || "";
          const formattedRoadmap = parsedOutput.formattedRoadmap || "";
          
          const insertQuery = `
            INSERT INTO roadmaps (
              candidate_id,
              duration,
              course_type,
              custom_instructions,
              plain_roadmap,
              formatted_roadmap,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, NOW())
          `;
          const insertValues = [
            candidateId,
            duration,
            courseType,
            customInstructions || "",
            plainRoadmap,
            formattedRoadmap
          ];
          db.query(insertQuery, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Database insert error:", insertErr);
              return res.status(500).json({ error: "Failed to save generated roadmap." });
            }
            parsedOutput.roadmapId = insertResult.insertId;
            return res.json(parsedOutput);
          });
        } catch (aiError) {
          console.error("AI generation error:", aiError);
          return res.status(500).json({ error: "Failed to generate roadmap." });
        }
      });
    } catch (error) {
      console.error("Error in /generate-roadmap:", error);
      return res.status(500).json({ error: "An unexpected error occurred while generating the roadmap." });
    }
  });
  


      // Use the developer-supplied Gemini API key (replace with your actual key)AIzaSyAn80_YQIrqBr9ZCWrbX0f0qyZ_gpopQPs
   
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;

