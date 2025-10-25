const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const newsRoutes = require("./routes/newsRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "News API Server is running!" });
});

app.use("/api/news", newsRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
