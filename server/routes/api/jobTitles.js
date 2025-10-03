// routes/api/jobTitles.js
const express = require('express');
const router = express.Router();
const JobTitle = require('../../models/JobTitle');

// @route   GET api/job-titles
// @desc    Get all job titles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const titles = await JobTitle.find().sort({ name: 1 });
    // Send back an array of strings
    res.json(titles.map(t => t.name));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;