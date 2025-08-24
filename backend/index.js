import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", 
  "https://courseapp-xi.vercel.app",
  "https://dev100x.vercel.app",
  "https://dev100x-frontend.vercel.app"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// API routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === "production" 
      ? "Something went wrong!" 
      : err.message 
  });
});

// Start server
const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Available at: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`}`);
  });
});
