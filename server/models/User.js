// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    default: "jobseeker",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Fix OverwriteModelError
module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
