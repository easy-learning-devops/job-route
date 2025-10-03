// server.js
const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware - Increase payload limits for base64 uploads
app.use(express.json({ limit: "10mb", extended: false }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => res.send("JobConnect API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/jobs", require("./routes/api/jobs"));
app.use("/api/employer-profile", require("./routes/api/employerProfile"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/applications", require("./routes/api/applications"));
app.use("/api/job-titles", require("./routes/api/jobTitles"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
