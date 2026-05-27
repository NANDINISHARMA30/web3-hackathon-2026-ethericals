require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// API key auth middleware
const VALID_KEYS = new Set((process.env.API_KEYS || "test_key,demo_key_123").split(",").map(k => k.trim()));

function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"] || req.query.apiKey;
  if (!key || !VALID_KEYS.has(key)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
}

// Routes
app.use("/api/earn",    requireApiKey, require("./routes/earn"));
app.use("/api/spend",   requireApiKey, require("./routes/spend"));
app.use("/api/buy",     requireApiKey, require("./routes/buy"));
app.use("/api/balance", requireApiKey, require("./routes/balance"));

// Health
app.get("/api/health", (req, res) => res.json({ status: "ok", version: "1.0.0" }));

// Serve SDK
app.use("/sdk", express.static(path.join(__dirname, "../sdk")));

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SharpKit backend running on http://localhost:${PORT}`));
