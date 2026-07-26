require("dotenv").config();
const connectDB = require("../config/db");
const InterviewRole = require("../models/InterviewRole");

const roles = [
  {
    title: "Frontend Developer",
    description: "Focuses on UI, JavaScript frameworks, HTML/CSS, and browser-side logic.",
    category: "Software Engineering",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
  {
    title: "Backend Developer",
    description: "Focuses on APIs, databases, server logic, and system design.",
    category: "Software Engineering",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
  {
    title: "Data Analyst",
    description: "Focuses on SQL, data visualization, statistics, and business insights.",
    category: "Data Science",
    difficulty: "beginner",
    totalQuestions: 5,
  },
  {
    title: "Full Stack Developer",
    description: "Handles both frontend and backend, connecting UI with server logic and databases.",
    category: "Software Engineering",
    difficulty: "advanced",
    totalQuestions: 5,
  },
  {
    title: "DevOps Engineer",
    description: "Focuses on CI/CD pipelines, cloud infrastructure, automation, and deployment.",
    category: "Software Engineering",
    difficulty: "advanced",
    totalQuestions: 5,
  },
  {
    title: "Mobile App Developer",
    description: "Builds native or cross-platform mobile applications for Android/iOS.",
    category: "Software Engineering",
    difficulty: "intermediate",
    totalQuestions: 5,
  },
];

const seedRoles = async () => {
  try {
    await connectDB();

    for (const role of roles) {
      await InterviewRole.findOneAndUpdate(
        { title: role.title },
        role,
        { upsert: true, new: true }
      );
    }

    console.log(" 6 roles seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(" Seeding failed:", err.message);
    process.exit(1);
  }
};

seedRoles();