// models/JobTitle.js
const mongoose = require('mongoose');

const JobTitleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('jobTitle', JobTitleSchema);