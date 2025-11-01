import express from 'express';
import { Router } from "express";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

const app = express();
const port = process.env.TODO_PORT || 3000;
const router = Router();
// Load environment variables
dotenv.config({ path: "../../.env" });

const env = process.env.NODE_ENV || "development";

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 * @returns {object} 200 - Server status, uptime, memory usage, versions
 * @example
 * {
 *   "status": "success",
 *   "timestamp": "2025-11-02T00:00:00.000Z",
 *   "data": {
 *     "message": "Server is healthy",
 *     "uptime": 12345,
 *     "memoryUsage": { "rss": 2345678, "heapTotal": 1234567, "heapUsed": 987654 },
 *     "sessionId": "123e4567-e89b-12d3-a456-426614174000",
 *     "appVersion": "1.0.0",
 *     "apiVersion": "v1.0"
 *   }
 * }
 */
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    sendResponse(res, {
      
      message: "Server is healthy",
      endpoints: ["/health"],
      uptime,
      memoryUsage,
      sessionId: res.app.locals.sessionId,
      appVersion: res.app.locals.appVersion,
      apiVersion: res.app.locals.apiVersion,
    });
  })
);


// Root info
router.get(
  "/",
  asyncHandler(async (req, res) => {
    sendResponse(res, {
      message: "Welcome to API Root version " + res.app.locals.apiVersion,
      endpoints: ["/"],
      versionedApi: `/api/${res.app.locals.apiVersion}/`,
    });
  })
);
export default router;