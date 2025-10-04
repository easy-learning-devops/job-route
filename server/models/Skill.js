// models/Skill.js
const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("skill", SkillSchema);
