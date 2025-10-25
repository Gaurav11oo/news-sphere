// backend/src/server.js or backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");

dotenv.config();

const newsRoutes = require("./routes/newsRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "📰 News API Server is running!" });
});

// ✅ Existing route
app.use("/api/news", newsRoutes);

// ✅ New route (for frontend calls to `/api/top-headlines`)
app.get("/api/top-headlines", async (req, res) => {
  try {
    const { category = "general", page = 1, q = "" } = req.query;

    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        category,
        lang: "en",
        max: 10,
        page,
        q,
        apikey: process.env.GNEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ GNews API error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(
    `🔗 Allowed Origins: ${
      process.env.ALLOWED_ORIGINS || "All (*)"
    }`
  );
});

module.exports = app;
