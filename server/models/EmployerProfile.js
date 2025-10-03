// models/EmployerProfile.js
const mongoose = require('mongoose');

const EmployerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    unique: true,
  },
  companyName: { type: String, required: true },
  companyWebsite: { type: String },
  companyDescription: { type: String },
  address: { type: String },
  organizationSize: { type: String },
});

module.exports = mongoose.model('employerProfile', EmployerProfileSchema);