require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const startupRoutes = require("./routes/startupRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const app = express();

// =====================
// Database
// =====================
connectDB();

// =====================
// Middlewares
// =====================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// =====================
// Health
// =====================
app.get("/", (req, res) => {
  res.send("🚀 Startup Connect API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// =====================
// Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/newsletter", newsletterRoutes);

// =====================
// 404
// =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

// =====================
// HTTP + SOCKET
// =====================

const httpServer = http.createServer(app);

const io = initSocket(httpServer);

app.set("io", io);

// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});