// models/Profile.js
const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  photo: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Third Gender"] },
  location: { type: String },
  education: [
    {
      qualification: { type: String },
      degree: { type: String },
      school: { type: String },
      passingYear: { type: Number },
    },
  ],
  experience: [
    {
      isExperienced: { type: Boolean },
      totalYears: { type: Number },
      jobTitle: { type: String },
      company: { type: String },
      currentSalary: { type: Number },
      department: { type: String },
      roleCategory: { type: String },
      skills: [{ type: String }],
      industry: { type: String },
      roleExperienceYears: { type: Number },
    },
  ],
  englishProficiency: {
    type: String,
    enum: ["No English", "Thoda English", "Good English", "Fluent English"],
  },
  languagesKnown: [{ type: String }],
  resume: { type: String }, // Will store a URL or filename
  preferredLocations: [{ type: String }],
});

module.exports = mongoose.model("profile", ProfileSchema);
