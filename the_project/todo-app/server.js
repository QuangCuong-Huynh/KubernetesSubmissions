import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import app from "./app.js";

// --------------------------
// Load environment variables
// --------------------------
dotenv.config({ path: "../../.env" });

// --------------------------
// Config
// --------------------------
const PORT = process.env.TODO_PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? "development";

// Extract app-level info
const { sessionId, appVersion, apiVersion } = app.locals;

// --------------------------
// Security & Middleware
// --------------------------
app.use(helmet());          // Secure headers
app.use(cors());            // Cross-Origin Resource Sharing
app.use(morgan("tiny"));    // Log HTTP requests
app.use(express.json());    // Parse JSON bodies

// --------------------------
// Rate Limiting
// --------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// --------------------------
// Start server
// --------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${ENV}]`);
  console.log(`Session ID: ${sessionId}`);
  console.log(`App Version: ${appVersion}, API Version: ${apiVersion}`);
  console.log(`Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
});
