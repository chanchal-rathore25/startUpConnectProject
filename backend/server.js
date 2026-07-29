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

const app = express();

connectDB();
 
app.use(
  cors({
    origin:  process.env.CLIENT_URL  || "http://localhost:5173",
  })
);
app.use(express.json());
// // ---------- routes ----------
app.get("/", (req, res) => {
  res.send("🚀 Startup Connect API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/startups", startupRoutes);
 
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Global error handler (multer errors etc.) ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Express app ko raw http server me wrap karte hain taaki Socket.io usi port pe chal sake
const httpServer = http.createServer(app);
const io = initSocket(httpServer);
app.set("io", io); // REST controllers isse req.app.get("io") se access kar sakte hain
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on http://localhost:${PORT}`));
