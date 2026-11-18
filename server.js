require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure DB connection on serverless requests before hitting API routes
app.use("/api", async (req, res, next) => {
  await connectDB();
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: require("./config/db").isDbConnected() ? "mongodb" : "in-memory",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

// API 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Serve built frontend static files (used locally and in AI Studio)
const frontendDist = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendDist));

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(frontendDist, "favicon.svg"));
});

// SPA fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Mongoose offline error handler
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("Database offline — returning fallback response");
    if (req.method === "GET") {
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({
      success: false,
      error: "Service temporarily unavailable (database offline)",
    });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

const PORT = 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;