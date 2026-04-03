// Load environment variables from .env file (must be first!)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

// Create the Express app
const app = express();

// --- Middleware ---
// These run on EVERY request before it reaches your routes

// cors() allows your React frontend to call this backend
// In production, you'd restrict this to your actual frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// express.json() parses incoming JSON request bodies
// Without this, req.body would be undefined when someone sends you JSON data
app.use(express.json());

// --- Routes ---

// A simple test route to make sure everything works
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// Auth routes: /api/auth/register and /api/auth/login
app.use("/api/auth", authRoutes);

// Task routes: /api/tasks (all protected by auth middleware)
app.use("/api/tasks", taskRoutes);

// --- Start the server ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
