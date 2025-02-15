// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); // For JWT authentication
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");
const fs = require("fs");


const app = express();
const port = 3000;

// Configure multer to store files on disk (make sure the 'uploads' folder exists)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Use middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',              
  user: 'root',                   
  password: 'root',       
  database: 'metamind_db' ,
  port: 5000          
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Import additional routes
const coursesRoutes = require('./routes/courses'); // Skill Surge endpoints
// (If you have a separate auth routes file, you can also import it. Here, auth endpoints are inlined.)

// Use the courses routes on /api/courses
app.use('/api/courses', coursesRoutes);

// ========================
// Signup Endpoint
// ========================
app.post('/signup', async (req, res) => {
  const { fullName, email, password, category } = req.body;
  
  if (!fullName || !email || !password || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the users table
    const query = `
      INSERT INTO users (fullName, email, password, category)
      VALUES (?, ?, ?, ?)
    `;
    connection.query(query, [fullName, email, hashedPassword, category], (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      const userId = results.insertId;
      
      // Create an empty profile row for the new user in the profiles table
      const createProfileQuery = "INSERT INTO profiles (user_id) VALUES (?)";
      connection.query(createProfileQuery, [userId], (err2) => {
        if (err2) {
          console.error("Error creating profile:", err2);
          // Optionally, you can continue even if profile creation fails
        }
        
        // Create a JWT token for the new user
        const token = jwt.sign({ id: userId }, 'your_secret_key', { expiresIn: '1h' });
        
        // Return the token and basic user profile information
        res.status(201).json({
          message: "User registered successfully",
          token,
          user: {
            id: userId,
            fullName,
            email,
            category,
            about: "Write something about yourself..." // default placeholder
          }
        });
      });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// Login Endpoint
// ========================
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    
    const user = results[0];
    
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
      
      // Check if a progress record exists for the user
      const progressQuery = "SELECT * FROM user_progress WHERE user_id = ?";
      connection.query(progressQuery, [user.id], (progressErr, progressResults) => {
        if (progressErr) {
          console.error("Error fetching user progress:", progressErr);
          return res.status(500).json({ error: "Database error" });
        }
        
        if (progressResults.length === 0) {
          // No progress record exists, so create one with default values
          const insertProgressQuery = "INSERT INTO user_progress (user_id, credits, badges, enrolled_courses) VALUES (?, 100, 0, '')";
          connection.query(insertProgressQuery, [user.id], (insertErr) => {
            if (insertErr) {
              console.error("Error inserting user progress:", insertErr);
              return res.status(500).json({ error: "Database error" });
            }
            // Now that progress is created, generate the token and return response
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
            return res.json({
              message: "Login successful",
              token,
              userId: user.id,
              fullName: user.fullName,
              email: user.email,
              category: user.category
            });
          });
        } else {
          // Progress record already exists—simply generate the token and return the response
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
          return res.json({
            message: "Login successful",
            token,
            userId: user.id,
            fullName: user.fullName,
            email: user.email,
            category: user.category
          });
        }
      });
    } catch (err) {
      console.error("Error comparing passwords:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// ========================
// JWT Authentication Middleware
// ========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  jwt.verify(token, 'your_secret_key', (err, userData) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = userData; // Attach user data (id) to the request
    next();
  });
};

// ========================
// GET Profile Endpoint
// ========================
app.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT u.fullName, u.email,
           COALESCE(p.dob, '') AS dob,
           COALESCE(p.gender, '') AS gender,
           COALESCE(p.phone, '') AS phone,
           COALESCE(p.street, '') AS street,
           COALESCE(p.city, '') AS city,
           COALESCE(p.state, '') AS state,
           COALESCE(p.country, '') AS country,
           COALESCE(p.zip, '') AS zip,
           COALESCE(p.educationLevel, '') AS educationLevel,
           COALESCE(p.fieldOfStudy, '') AS fieldOfStudy,
           COALESCE(p.institution, '') AS institution,
           COALESCE(p.dreamJob, '') AS dreamJob,
           COALESCE(p.dreamCompany, '') AS dreamCompany,
           COALESCE(p.shortTermGoals, '') AS shortTermGoals,
           COALESCE(p.longTermGoals, '') AS longTermGoals,
           COALESCE(p.strengths, '') AS strengths,
           COALESCE(p.strengthsText, '') AS strengthsText,
           COALESCE(p.weaknesses, '') AS weaknesses,
           COALESCE(p.hobbies, '') AS hobbies,
           COALESCE(p.interests, '') AS interests,
           COALESCE(p.bio, '') AS bio,
           COALESCE(p.resume, '') AS resume,
           COALESCE(p.profilePicture, '') AS profilePicture
    FROM users u 
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// ========================
// PUT Profile Endpoint (Update Profile with File Upload)
// ========================
app.put('/profile', authenticateToken, 
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ]),
  (req, res) => {
    const userId = req.user.id;
    const {
      dob, gender, phone,
      street, city, state, country, zip,
      educationLevel, fieldOfStudy, institution,
      dreamJob, dreamCompany, shortTermGoals, longTermGoals,
      strengths, strengthsText, weaknesses, hobbies, interests,
      bio
    } = req.body;
    
    const resumeFile = req.files['resume'] ? req.files['resume'][0].path : null;
    const profilePictureFile = req.files['profilePicture'] ? req.files['profilePicture'][0].path : null;
    
    const query = `
      INSERT INTO profiles (
        user_id, dob, gender, phone,
        street, city, state, country, zip,
        educationLevel, fieldOfStudy, institution,
        dreamJob, dreamCompany, shortTermGoals, longTermGoals,
        strengths, strengthsText, weaknesses, hobbies, interests, bio, resume, profilePicture
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        dob = VALUES(dob),
        gender = VALUES(gender),
        phone = VALUES(phone),
        street = VALUES(street),
        city = VALUES(city),
        state = VALUES(state),
        country = VALUES(country),
        zip = VALUES(zip),
        educationLevel = VALUES(educationLevel),
        fieldOfStudy = VALUES(fieldOfStudy),
        institution = VALUES(institution),
        dreamJob = VALUES(dreamJob),
        dreamCompany = VALUES(dreamCompany),
        shortTermGoals = VALUES(shortTermGoals),
        longTermGoals = VALUES(longTermGoals),
        strengths = VALUES(strengths),
        strengthsText = VALUES(strengthsText),
        weaknesses = VALUES(weaknesses),
        hobbies = VALUES(hobbies),
        interests = VALUES(interests),
        bio = VALUES(bio),
        resume = COALESCE(VALUES(resume), resume),
        profilePicture = COALESCE(VALUES(profilePicture), profilePicture)
    `;
    
    connection.query(query, [
      userId,
      dob, gender, phone,
      street, city, state, country, zip,
      educationLevel, fieldOfStudy, institution,
      dreamJob, dreamCompany, shortTermGoals, longTermGoals,
      strengths, strengthsText, weaknesses, hobbies, interests,
      bio,
      resumeFile, profilePictureFile
    ], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Profile updated successfully" });
    });
});


// GET Progress Endpoint
app.get('/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = "SELECT * FROM user_progress WHERE user_id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      // If no progress record exists, you could choose to return a default response
      return res.status(404).json({ error: "Progress record not found" });
    }
    res.json(results[0]);
  });
});


// GET Passport Endpoint with join to fetch user's name if record doesn't exist
app.get('/passport', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Join users and passport so we get the user's fullName as "name"
  const query = `
    SELECT u.fullName AS name, p.badges, p.skills, p.openSourceProjects, p.isApproved, p.updated_at
    FROM passport p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ?
  `;
  
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      // If no passport record exists, fetch the user's name from the users table
      const userQuery = "SELECT fullName FROM users WHERE id = ?";
      connection.query(userQuery, [userId], (userErr, userResults) => {
        if (userErr) {
          console.error("Database error fetching user data:", userErr);
          return res.status(500).json({ error: "Database error fetching user data" });
        }
        const fullName = (userResults.length > 0) ? userResults[0].fullName : "";
        const defaultPassport = {
          user_id: userId,
          name: fullName, // Use the fetched user's fullName
          badges: 0,
          skills: JSON.stringify([]),
          openSourceProjects: 0,
          isApproved: false
        };
        const insertQuery = "INSERT INTO passport SET ?";
        connection.query(insertQuery, defaultPassport, (insertErr, insertResults) => {
          if (insertErr) {
            console.error("Error creating passport:", insertErr);
            return res.status(500).json({ error: "Database error creating passport" });
          }
          return res.json(defaultPassport);
        });
      });
    } else {
      // Return the joined result with the user's name as "name"
      return res.json(results[0]);
    }
  });
});

app.put('/passport/approve', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { approved } = req.body; // Expecting a JSON object: { approved: true } or { approved: false }
  const query = "UPDATE passport SET isApproved = ? WHERE user_id = ?";
  connection.query(query, [approved, userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ approved });
  });
});



// ========================
// POST Submit Project Endpoint
// ========================
// ========================
// POST Submit Project Endpoint
// ========================
app.post('/submit-project', authenticateToken, (req, res) => {
  // Extract project details from the request body
  const {
    projectName,
    industryType,
    description,
    category,
    deliverables,
    techStack,
    deadline,
    budgetRange,
    companyName,
    website,
    contactEmail,
    additionalNotes
  } = req.body;

  // Get the authenticated user's ID
  const userId = req.user.id;

  // Insert a new project into the submitted_projects table
  const insertProjectQuery = `
    INSERT INTO submitted_projects (
      user_id,
      projectName,
      industryType,
      description,
      category,
      deliverables,
      techStack,
      deadline,
      budgetRange,
      companyName,
      website,
      contactEmail,
      additionalNotes,
      submission_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;

  connection.query(insertProjectQuery, [
    userId,
    projectName,
    industryType,
    description,
    category,
    deliverables,
    techStack,
    deadline,
    budgetRange,
    companyName,
    website,
    contactEmail,
    additionalNotes
  ], (err, results) => {
    if (err) {
      console.error("Error inserting submitted project:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const projectId = results.insertId;
    
    // Update the industry_activity table to increment the projects_submitted counter
    const updateActivityQuery = `
      UPDATE industry_activity
      SET projects_submitted = projects_submitted + 1
      WHERE user_id = ?
    `;
    connection.query(updateActivityQuery, [userId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Error updating industry activity:", updateErr);
        return res.status(500).json({ error: "Database error updating industry activity" });
      }
      res.json({ message: "Project submitted successfully", projectId });
    });
  });
});

// Optional: Base route to verify the API is running.
app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

// Helper function to remove code fences and trim text.
function repairJSON(text) {
  return text.replace(/```(json)?/gi, "").replace(/```/gi, "").trim();
}

// Helper function to get the user id from the Users table using candidateId.
function getUserId(candidateId) {
  // If candidateId is not provided or is the fallback string, default to a valid numeric ID (e.g., 1)
  if (!candidateId || candidateId === "default_candidate") {
    console.log("No valid candidateId provided, defaulting to 1");
    candidateId = "1";
  } else {
    console.log("getUserId received candidateId:", candidateId);
  }

  // Parse candidateId as an integer.
  const id = parseInt(candidateId, 10);
  if (isNaN(id)) {
    return Promise.reject(new Error("Invalid candidate ID"));
  }

  return new Promise((resolve, reject) => {
    // Look up the user in the Users table using the internal id.
    const query = "SELECT id FROM Users WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return reject(new Error("User not found"));
      }
      return resolve(results[0].id);
    });
  });
}


/**
 * POST /ask-roadmap
 * Accepts a JSON payload with candidateId and question.
 * If a roadmap flag is provided, uses additional parameters (domain, duration,
 * cheatSheet, certification) to generate a detailed weekly roadmap.
 */
app.post("/ask-roadmap", async (req, res) => {
  const { candidateId, question, roadmap } = req.body;
  if (!candidateId || (!question && !roadmap)) {
    return res.status(400).json({ error: "Candidate ID and question are required." });
  }
  
  try {
    // Look up the user ID from Users table.
    const userId = await getUserId(candidateId);
    
    // Use your developer-supplied Gemini API key (replace with your actual key)
    const DEVELOPER_GEMINI_API_KEY = "AIzaSyCcdvzrYpE4oNASepCf1zHRQAA32IdXA7Y";
    const genAI = new GoogleGenerativeAI(DEVELOPER_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let prompt = "";
    if (roadmap) {
      const { domain, duration, cheatSheet, certification } = req.body;
      prompt = `
You are an industry expert in career development and roadmap planning.
Create a detailed, actionable, and professional weekly roadmap for someone who wants to excel in ${domain} over a period of ${duration} month${duration > 1 ? "s" : ""}.
Include a tabular breakdown of weekly goals, suggested actions, recommended cheat sheets, and relevant course links.
Ensure the roadmap is structured with clear columns: Week, Goals, Actions, and Resources.
      `;
    } else {
      prompt = `
You are an industry expert in every field and a highly knowledgeable roadmap and career assistant.
Answer the following question in a clear, detailed, and professional manner with actionable advice.
Question: "${question}"
      `;
    }
    
    const result = await model.generateContent(prompt);
    let answer = result.response.text();
    answer = repairJSON(answer).trim();
    
    // Store the conversation log in the database.
    const insertQuery = `
      INSERT INTO chat_logs (candidate_id, question, answer, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    connection.query(insertQuery, [userId, question || (roadmap ? "Roadmap Request" : ""), answer], (err) => {
      if (err) {
        console.error("Error storing chat log:", err);
      }
    });
    
    return res.json({ answer });
  } catch (error) {
    console.error("Error generating answer with Gemini AI:", error);
    return res.status(500).json({ error: "Failed to generate answer." });
  }
});

//**
//  * GET /chat-logs
//  * Retrieves previous chat logs for a candidate.
//  * Expects a query parameter candidateId.
//  */
app.get("/chat-logs", (req, res) => {
  const candidateId = req.query.candidateId;
  if (!candidateId) {
    return res.status(400).json({ error: "Candidate ID is required." });
  }
  
  getUserId(candidateId)
    .then((userId) => {
      const query = "SELECT * FROM chat_logs WHERE candidate_id = ? ORDER BY created_at DESC";
      connection.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching chat logs:", err);
          return res.status(500).json({ error: "Failed to fetch chat logs." });
        }
        return res.json({ chatLogs: results });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to fetch user data." });
    });
});


// ========================
// Serve Static Files (if needed)
// ========================
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'skill.html'));
// });

// ========================
// Start the Server
// ========================





/////Assessment

const API_KEY_PHASE1 = "AIzaSyBhrWWpPP_mEk8pvGxIq8PobhHsiKCUdOg";
const API_KEY_PHASE2 = "AIzaSyBoyP7hnrs5bDaxc1yRmNSrwawii5Y8YeE";
const API_KEY_PHASE3 = "AIzaSyCjBQihIrbgqyIuKz4YoB_OfMtBelB-xus";

const genAIAptitude = new GoogleGenerativeAI(API_KEY_PHASE1);
const genAIVerbal   = new GoogleGenerativeAI(API_KEY_PHASE2);
const genAIDomain   = new GoogleGenerativeAI(API_KEY_PHASE3);


connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
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
Provide detailed, step-by-step feeconnectionack for each phase and calculate an overall score out of 100.
Return the evaluation as valid JSON in the following format:
{
  "scores": {
    "Phase 1 - Aptitude": <number>,
    "Phase 2 - Verbal": <number>,
    "Phase 3 - Domain-Specific": <number>
  },
  "overall_score": <number>,
  "feeconnectionack": {
    "Phase 1 - Aptitude": "<feeconnectionack text>",
    "Phase 2 - Verbal": "<feeconnectionack text>",
    "Phase 3 - Domain-Specific": "<feeconnectionack text>"
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
        feeconnectionack: {
          "Phase 1 - Aptitude": phaseScores["Phase 1 - Aptitude"] >= 30 ? "Excellent Aptitude Skills" : "Needs Improvement in Logical Thinking",
          "Phase 2 - Verbal": phaseScores["Phase 2 - Verbal"] >= 30 ? "Strong Command over Language" : "Work on Grammar and Comprehension",
          "Phase 3 - Domain-Specific": phaseScores["Phase 3 - Domain-Specific"] >= 30 ? "Strong Domain-Specific Knowledge" : "Needs Better Domain Understanding"
        }
      };
    }
    
    // Save the evaluation result in the database
    const query = `
      INSERT INTO results (candidate_name, domain, scores, overall_score, feeconnectionack)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      candidateName,
      domain,
      JSON.stringify(evaluation.scores),
      evaluation.overall_score,
      JSON.stringify(evaluation.feeconnectionack)
    ];
    connection.query(query, values, (err, connectionResult) => {
      if (err) {
        console.error("Error saving results to the database:", err);
        return res.status(500).json({ error: "Failed to save results to the database." });
      }
      console.log("Results saved to database with ID:", connectionResult.insertId);
      res.json({ id: connectionResult.insertId });
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
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching results from database:", err);
      return res.status(500).json({ error: "Failed to fetch results from the database." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No results found for the candidate." });
    }
    const result = results[0];
    result.scores = JSON.parse(result.scores);
    result.feeconnectionack = JSON.parse(result.feeconnectionack);
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
  connection.query(query, [candidateName], (err, results) => {
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
    pdfDoc.text("Feeconnectionack:");
    const feeconnectionack = JSON.parse(result.feeconnectionack);
    Object.entries(feeconnectionack).forEach(([phase, fb]) => {
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
function repairJSON(text) {
  // Remove code fences like ```json and ```
  let cleaned = text.replace(/```(json)?/gi, "").replace(/```/gi, "").trim();
  // Replace newline characters with a space to avoid unterminated strings in JSON
  cleaned = cleaned.replace(/\r?\n/g, " ");
  return cleaned;
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
    connection.query(query, [candidateId], async (err, results) => {
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
          feeconnectionack: JSON.parse(candidateResult.feeconnectionack)
        };
      } catch (parseError) {
        console.error("Error parsing candidate result JSON:", parseError);
        candidateData = {
          candidateName: candidateResult.candidate_name,
          domain: candidateResult.domain,
          scores: {},
          overallScore: candidateResult.overall_score,
          feeconnectionack: {}
        };
      }
      
      // Use the developer-supplied Gemini API key (replace with your actual key)
      const DEVELOPER_GEMINI_API_KEY = "AIzaSyBCkmTkiQfenF4ElkDSixq1hUivConnectiondv7EY";
      const roadmapGenAI = new GoogleGenerativeAI(DEVELOPER_GEMINI_API_KEY);
      const model = roadmapGenAI.getGenerativeModel({ model: "gemini-pro" });
      
      let courseTypeInstruction = "";
      if (courseType && courseType.toLowerCase() === "free") {
        courseTypeInstruction = "Focus on free online courses and resources with clickable links.";
      } else if (courseType && courseType.toLowerCase() === "paid") {
        courseTypeInstruction = "Focus on paid online courses, training programs, and certifications with clickable links.";
      } else {
        courseTypeInstruction = "Include both free and paid courses with clickable links.";
      }
      
      let additionalInstructions = "";
      if (customInstructions && customInstructions.trim() !== "") {
        additionalInstructions = `Additional candidate instructions: ${customInstructions.trim()}`;
      }
      
      // Build the detailed prompt.
      const prompt = `
Based on the following candidate's test results, generate a comprehensive, personalized, and industry-focused roadmap for the candidate to excel in the "${candidateData.domain}" domain.

Candidate Name: "${candidateData.candidateName}"
Overall Score: ${candidateData.overallScore}
Detailed Scores: ${JSON.stringify(candidateData.scores, null, 2)}
Feeconnectionack: ${JSON.stringify(candidateData.feeconnectionack, null, 2)}
Roadmap Duration: ${duration} month(s)
Course Preference: ${courseType}
${courseTypeInstruction}
${additionalInstructions}

Your roadmap should be extremely means extremely like point to point whihch covers everything each and everything detailed very detailed like 6 7 suggestions in each columns provided in two formats:

1. "plainRoadmap": Provide a detailed, week-by-week roadmap as plain text. List each week (e.g., "Week 1", "Week 2", etc.) along with the tasks for that week. For each task, include a checkbox indicator (e.g., "[ ]") that the candidate can manually tick.

2. "formattedRoadmap": Provide a structured HTML output that includes:
    - "roadmapTable": An HTML table where each row represents a week. The table must have the following columns:
         - **Week**
         - **Action Steps**
         - **Recommended Resources**
         - **Milestones**
         - **Completed** (this column should include an HTML checkbox element, for example, <input type="checkbox">)
    - "recommendedCourses": An HTML snippet with dynamic recommendations for online courses and certifications (include clickable URLs).
    - "industryTrends": An HTML snippet summarizing current industry trends and insights relevant to the "${candidateData.domain}" domain.
    - "careerGrowth": An HTML snippet offering detailed suggestions for career growth, including practical projects, further training recommendations, and a schedule for regular assessments.

Output only a single valid JSON object with these keys and no additional text.
      `;
      
      try {
        const roadmapResult = await model.generateContent(prompt);
        let responseText = roadmapResult.response.text();
        // Use the repairJSON helper function to clean up the response.
        responseText = repairJSON(responseText);
        responseText = responseText.trim();
        let parsedOutput;
        try {
          parsedOutput = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("Error parsing AI response as JSON:", jsonError);
          return res.status(500).json({ error: "AI response was not valid JSON.", raw: responseText });
        }
        
        // Insert the generated roadmap into the 'roadmaps' table
        const insertQuery = `
          INSERT INTO roadmaps (candidate_id, duration, course_type, custom_instructions, plain_roadmap, formatted_roadmap, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const insertValues = [
          candidateId,
          duration,
          courseType,
          customInstructions || "",
          parsedOutput.plainRoadmap,
          JSON.stringify(parsedOutput.formattedRoadmap)
        ];
        connection.query(insertQuery, insertValues, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error saving roadmap to the database:", insertErr);
            return res.status(500).json({ error: "Failed to save generated roadmap to the database." });
          }
          // Optionally add the roadmap ID to the response
          parsedOutput.roadmapId = insertResult.insertId;
          return res.json(parsedOutput);
        });
        
      } catch (aiError) {
        console.error("Error generating roadmap with Gemini AI:", aiError);
        return res.status(500).json({ error: "Failed to generate roadmap." });
      }
    });
  } catch (error) {
    console.error("Error in /generate-roadmap:", error);
    return res.status(500).json({ error: "An unexpected error occurred while generating the roadmap." });
  }
});




// Use separate API keys for each phase – replace these with your valid keys.


      // Use the developer-supplied Gemini API key (replace with your actual key)AIzaSyAn80_YQIrqBr9ZCWrbX0f0qyZ_gpopQPs

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


module.exports = app;
