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
  // If candidateId is not provided or is the fallback string, default to a valid numeric ID (e.g., 1).
  if (!candidateId || candidateId === "default_candidate") {
    console.log("No valid candidateId provided, defaulting to 1");
    candidateId = 1;
  } else {
    console.log("getUserId received candidateId:", candidateId);
  }

  return new Promise((resolve, reject) => {
    // Your Users table uses "id" as the primary key.
    const query = "SELECT id FROM Users WHERE id = ?";
    connection.query(query, [candidateId], (err, results) => {
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

/**
 * GET /chat-logs
 * Retrieves previous chat logs for a candidate.
 * Expects a query parameter candidateId.
 */
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



// Use separate API keys for each phase – replace these with your valid keys.


      // Use the developer-supplied Gemini API key (replace with your actual key)AIzaSyAn80_YQIrqBr9ZCWrbX0f0qyZ_gpopQPs

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


module.exports = app;
