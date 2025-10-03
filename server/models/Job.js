// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  jobType: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  subLocation: { type: String },
  openings: { type: Number, required: true },
  experienceRequired: { type: String, required: true }, // Any, Fresher Only, Experienced Only
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  hasBonus: { type: Boolean, default: false },
  description: { type: String, required: true, maxlength: 350 },
  skills: [{ type: String }],
  jobTimings: { type: String },
  interviewDetails: { type: String },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPersonProfile: { type: String },
  organizationSize: { type: String },
  jobAddress: { type: String },
  hiringFrequency: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('job', JobSchema);