// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Viewed', 'Shortlisted', 'Rejected'],
    default: 'Applied',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
});

// Prevent a user from applying to the same job twice
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('application', ApplicationSchema);