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
  console.log('Connected to metamind database');
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
// POST /submit-project endpoint
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

  // Get the authenticated user's id
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
  ], (err, result) => {
    if (err) {
      console.error("Error inserting submitted project:", err);
      return res.status(500).json({ error: "Database error inserting project" });
    }

    const projectId = result.insertId;
    
    // Upsert the industry_activity record:
    // If a record doesn't exist, insert one with projects_submitted = 1.
    // If it exists, increment projects_submitted by 1.
    const upsertQuery = `
      INSERT INTO industry_activity (user_id, projects_submitted, virtual_rooms_created)
      VALUES (?, 1, 0)
      ON DUPLICATE KEY UPDATE projects_submitted = projects_submitted + 1;
    `;
    connection.query(upsertQuery, [userId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating industry activity:", updateErr);
        return res.status(500).json({ error: "Database error updating industry activity" });
      }

      return res.json({ message: "Project submitted successfully", projectId });
    });
  });
});

// GET endpoint to fetch submitted projects for the authenticated user
app.get('/api/submitted_projects', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT 
      project_id,
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
    FROM submitted_projects
    WHERE user_id = ?
  `;
  
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching submitted projects:", err);
      return res.status(500).json({ error: "Database error fetching submitted projects" });
    }
    res.json(results);
  });
});

// --------------------------
// Endpoint: Create Virtual Room Project
// --------------------------
app.post('/api/virtual_room_projects', authenticateToken, async (req, res) => {
  try {
    const { name, email, purpose, participants, durationType, duration, price } = req.body;
    const user_id = req.user.user_id; // Obtained from the decoded token

    // Insert a new record into the virtual_room_projects table.
    // Note: "price" is not stored per your schema.
    const result = await connection.execute(
      `INSERT INTO virtual_room_projects (name, email, purpose, participants, durationType, duration)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, purpose, participants, durationType, duration]
    );

    // Expecting result.insertId to hold the new record's ID.
    res.status(201).json({ message: 'Virtual room project created', project_id: result.insertId });
  } catch (error) {
    console.error("Error creating virtual room project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to increment the virtual_rooms_created count in industry_activity
app.patch('/api/industry_activity/:user_id/increment', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    // Use alternative keys in case user_id is not directly present in the token
    const tokenUserId = req.user.user_id || req.user.sub || req.user.id;
    if (parseInt(user_id, 10) !== parseInt(tokenUserId, 10)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // Increment by the amount specified in the request (default is 1)
    const increment = req.body.virtual_rooms_created || 1;

    // Execute the update without destructuring the result
    const result = await connection.execute(
      `UPDATE industry_activity SET virtual_rooms_created = virtual_rooms_created + ? WHERE user_id = ?`,
      [increment, user_id]
    );

    // If no rows were updated, insert a new record for the user
    if (result.affectedRows === 0) {
      await connection.execute(
        `INSERT INTO industry_activity (user_id, projects_submitted, virtual_rooms_created) VALUES (?, 0, ?)`,
        [user_id, increment]
      );
    }
    res.json({ message: "Industry activity updated" });
  } catch (error) {
    console.error("Error updating industry activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch industry activity data
app.get('/api/industry_activity', (req, res) => {
  // For this example, we assume you're fetching data for user_id = 1
  const userId = 8;
  const query = 'SELECT projects_submitted, virtual_rooms_created FROM industry_activity WHERE user_id = ?';
  
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching industry activity:', error);
      return res.status(500).json({ error: 'Error fetching industry activity' });
    }
    
    if (results.length > 0) {
      // Return the first row
      return res.json(results[0]);
    } else {
      // If no record exists, return default values
      return res.json({ projects_submitted: 0, virtual_rooms_created: 0 });
    }
  });
});

// Endpoint: Fetch submitted projects (static user id = 8)
app.get('/api/submitted_projects', (req, res) => {
  const userId = 8;
  const query = 'SELECT id, project_name FROM submitted_projects WHERE user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching submitted projects:', error);
      return res.status(500).json({ error: 'Error fetching submitted projects' });
    }
    return res.json(results);
  });
});

// Endpoint: Fetch virtual room projects (static user id = 8)
// Removed the "id" field because it's not available in your table.
// app.get('/api/virtual_room_projects', (req, res) => {
//   const userId = 8;
//   const query = 'SELECT project_name FROM virtual_room_projects WHERE user_id = ?';
//   connection.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching virtual room projects:', error);
//       return res.status(500).json({ error: 'Error fetching virtual room projects' });
//     }
//     return res.json(results);
//   });
// })



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


const bodyParser = require('body-parser');
const {
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyAM6m4SGI_81LyFb5UPpkJ0JHq6D1VSFwM"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Function to generate questions
async function generateQuestions() {
  try {
    const chatSession = model.startChat({
        generationConfig: {},  // Define any specific config needed for your model
        history: [],
    });

    const personaDescription = `The company "47 Billion" is a UI/UX design company specializing in backend development for Node.js. It upholds the following core values:

    - Ethical: The choice between right and wrong should be the first priority.
    - Sincerity with a "Can do" attitude: Constantly changing conditions cannot impact the aim.
    - Innovation.
    - Value Family.
    - Accountability.
    - Humble and Respectful.

    Based on this persona, generate five insightful small questions that reflect the company's values and help assess alignment with them.
    IMPORTANT: Output the result as strictly in pure JSON with no additional text, no ellipses, and no extra commas.`;

    const result = await chatSession.sendMessage(personaDescription);
    return cleanUpJsonInput(result.response.text());
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
}

// Endpoint to generate questions
app.get('/generate-questions', async (req, res) => {
    try {
        const questions = await generateQuestions();
        console.log('Generated Questions:', questions); // Log generated questions
        res.json(questions);  // Send generated questions as JSON response
    } catch (error) {
        console.error("Error in /generate-questions:", error);
        res.status(500).json({ error: 'An error occurred while generating questions.' });
    }
});

// Cleanup function to remove unwanted characters, markdown, and backticks
function cleanUpJsonInput(inputString) {
  const cleanedString = inputString
    .replace(/```json/g, '')   // Remove opening code block delimiters
    .replace(/```/g, '')       // Remove closing code block delimiters
    .replace(/^\s*[\r\n]+/g, '') // Remove any extra newlines at the start
    .replace(/[\r\n]+\s*$/g, '') // Remove any extra newlines at the end
    .trim();                   // Trim leading and trailing whitespace

  try {
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error('Invalid JSON format:', error);
    throw new Error('The provided input is not valid JSON.');
  }
}

async function evaluateAnswers(userAnswers) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const evaluationPrompt = `Evaluate the following interview answers by comparing them with ideal responses based on the company's persona. Provide feedback in the following format:
        company"s persona is :The company "47 Billion" is a UI/UX design company specializing in backend development for Node.js. It upholds the following core values:

    - Ethical: The choice between right and wrong should be the first priority.
    - Sincerity with a "Can do" attitude: Constantly changing conditions cannot impact the aim.
    - Innovation.
    - Value Family.
    - Accountability.
    - Humble and Respectful.

        - Analysis of each question's answer in one-line bullet points.
        - A concluding feedback summary.
        - IMPORTANT: Output the result as strictly in pure JSON with no additional text, no ellipses, and no extra commas.
        _ example json is : 


        User's Answers:
        ${JSON.stringify(userAnswers, null, 2)}`;

        const result = await chatSession.sendMessage(evaluationPrompt);
      
        return cleanUpJsonInput(result.response.text());
    } catch (error) {
        console.error('Error evaluating answers:', error);
        throw new Error('Failed to evaluate answers');
    }
}
function cleanUpJsonInput(inputString) {
  const cleanedString = inputString
    .replace(/```json/g, '')   // Remove opening code block delimiters
    .replace(/```/g, '')       // Remove closing code block delimiters
    .replace(/^\s*[\r\n]+/g, '') // Remove any extra newlines at the start
    .replace(/[\r\n]+\s*$/g, '') // Remove any extra newlines at the end
    .trim();                   // Trim leading and trailing whitespace

  try {
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error('Invalid JSON format:', error);
    throw new Error('The provided input is not valid JSON.');
  }
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/evaluate', async (req, res) => {
  try {
      console.log("Request received at /evaluate");
      console.log("Request Body:", req.body);  // Log the entire body of the request

      let userAnswers = req.body.answers;

      if (typeof userAnswers === 'string') {
          userAnswers = cleanUpJsonInput(userAnswers);
      }

      if (!userAnswers || typeof userAnswers !== 'object') {
          return res.status(400).json({ error: 'Invalid input. Expected an object of answers.' });
      }

      const feedback = await evaluateAnswers(userAnswers);
      res.json({ feedback });

  } catch (error) {
      console.error("Error in /evaluate:", error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});






// ========================
// Start the Server
// ========================
      // Use the developer-supplied Gemini API key (replace with your actual key)AIzaSyAn80_YQIrqBr9ZCWrbX0f0qyZ_gpopQPs

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
// This will execute when the server is started
// Example usage of generateQuestions:
generateQuestions(); 

module.exports = app;
