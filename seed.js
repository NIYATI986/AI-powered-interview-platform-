// One-time script to populate the database with some starter interview roles.
// Run with: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const InterviewRole = require("./models/InterviewRole");

const roles = [
  {
    title: "Frontend Developer",
    description: "Focuses on HTML, CSS, JavaScript, React and UI/UX best practices.",
    category: "Software Engineering",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
  {
    title: "Backend Developer",
    description: "Focuses on APIs, databases, system design and server-side logic.",
    category: "Software Engineering",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
  {
    title: "Data Analyst",
    description: "Focuses on SQL, statistics, data visualization and business insights.",
    category: "Data Science",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
  {
    title: "HR / Behavioral Round",
    description: "General behavioral and situational questions for any role.",
    category: "HR",
    difficulty: "beginner",
    totalQuestions: 5,
  },
];

const seed = async () => {
  await connectDB();
  await InterviewRole.deleteMany({});
  await InterviewRole.insertMany(roles);
  console.log("Interview roles seeded successfully");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
