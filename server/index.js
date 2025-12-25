import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

dotenv.config();

const app = express();

// ✅ Connect services
connectCloudinary();

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("QuickAI Server is Live 🚀");
});

// ✅ API routes
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// ✅ Single PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
