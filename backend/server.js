const User = require("./models/User");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
// const pdfParse = require("pdf-parse").default || require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Multer storage ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ── Basic routes ────────────────────────────────────────────
app.get("/", (req, res) => res.send("Home Route"));

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ── Auth routes ─────────────────────────────────────────────
app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    score: req.body.score,
  });
  await newUser.save();
  res.json({ message: "Signup Successful" });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "User Not Found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.json({ message: "Wrong Password" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ message: "Login Successful", token });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected Data Accessed", user: req.user });
});

// ── User CRUD ───────────────────────────────────────────────
app.post("/add-user", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    role: req.body.role,
    score: req.body.score,
  });
  await newUser.save();
  res.json({ message: "User Added" });
});

app.put("/update-user/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    role: req.body.role,
    score: req.body.score,
  });
  res.json({ message: "User Updated" });
});

app.delete("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User Deleted" });
});

// ── Resume upload (just saves file) ─────────────────────────
app.post("/upload-resume", upload.single("resume"), (req, res) => {
  res.json({ message: "Resume Uploaded", file: req.file });
});

// ── Resume parse (returns raw text) ─────────────────────────
app.post("/parse-resume", upload.single("resume"), async (req, res) => {
  const dataBuffer = fs.readFileSync(req.file.path);
  const pdfData = await pdfParse(dataBuffer);
  res.json({ text: pdfData.text });
});

// ── MAIN: AI Resume Analyze ──────────────────────────────────
app.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    // 1. Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const jobDescription = req.body.jobDescription || "";

    // 2. Basic skill matching (fast, no API needed)
    const text = resumeText.toLowerCase();
    const jdText = jobDescription
      ? jobDescription.toLowerCase()
      : "react node mongodb express javascript html css sql";

    const requiredSkills = [
      "react", "node", "mongodb", "express", "javascript",
      "html", "css", "sql", "typescript", "python",
      "git", "rest", "api", "tailwind", "redux",
    ];

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach((skill) => {
      if (text.includes(skill)) {
        if (jdText.includes(skill)) matchedSkills.push(skill);
      } else {
        if (jdText.includes(skill)) missingSkills.push(skill);
      }
    });
    const score = Math.round(
      (matchedSkills.length / Math.max(matchedSkills.length + missingSkills.length, 1)) * 100
    );

    // 3. Ask Gemini for smart AI feedback
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an expert resume reviewer and career coach.

Analyze this resume against the job description and provide structured feedback.

RESUME TEXT:
${resumeText.slice(0, 1500)}
JOB DESCRIPTION:
${jobDescription || "General full-stack developer role"}

Respond ONLY with a valid JSON object in this exact format (no markdown, no backticks):
{
  "overallFeedback": "2-3 sentence overall assessment of the resume",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "missingSkills": ["skill1", "skill2", "skill3"],
  "rewrittenSummary": "A rewritten professional summary paragraph for this person based on their resume, optimized for this job",
  "atsScore": <number between 0 and 100>
}
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Parse Gemini response safely
    let aiData;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      aiData = JSON.parse(cleaned);
    } catch {
      aiData = {
        overallFeedback: "AI analysis completed. Review matched and missing skills below.",
        strengths: ["Resume successfully parsed"],
        improvements: ["Add more relevant keywords from the job description"],
        missingSkills: missingSkills,
        rewrittenSummary: "Please add a strong professional summary to your resume.",
        atsScore: score,
      };
    }

    // 4. Send combined response
    res.json({
      score: aiData.atsScore || score,
      matchedSkills,
      missingSkills: aiData.missingSkills || missingSkills,
      overallFeedback: aiData.overallFeedback,
      strengths: aiData.strengths,
      improvements: aiData.improvements,
      rewrittenSummary: aiData.rewrittenSummary,
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ message: "Analysis failed", error: error.message });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
