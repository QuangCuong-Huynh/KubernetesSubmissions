import express from "express";
import { v7 as uuidv7 } from "uuid";

const app = express();
const port = process.env.PORT || 3000;

// Generate random string once on startup
const randomId = uuidv7();

console.log(`🚀 Application started. Session ID: ${randomId}`);

// Print every 5 seconds with timestamp
setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomId}`);
}, 5000);

// Minimal HTTP server
app.get("/", (req, res) => {
  res.send(`Server running. Session ID: ${randomId}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Graceful shutdown (useful in Kubernetes)
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});
