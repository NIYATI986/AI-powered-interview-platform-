require("dotenv").config();



const express = require("express");
const cors = require("cors");
const connectDB = require("./db");  

const app = express();

// Connect Database
connectDB();  

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("AI Interview Platform Backend");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});