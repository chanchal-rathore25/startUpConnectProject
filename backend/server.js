require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const startupRoutes = require("./routes/startupRoutes");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();
 
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
// ---------- routes ----------
app.get("/", (req, res) => {
  res.send("🚀 Startup Connect API is running");
});
app.use("/api/startups", startupRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
 
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on http://localhost:${PORT}`));
