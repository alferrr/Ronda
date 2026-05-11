require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", app: "Ronda API" }),
);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found." }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Ronda API running on port ${PORT}`));

module.exports = app;
