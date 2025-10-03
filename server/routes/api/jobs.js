// routes/api/jobs.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Profile = require("../../models/Profile");

// @route   POST api/jobs
// @desc    Create a job
// @access  Private
router.post("/", [auth, checkRole("employer")], async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      postedBy: req.user.id,
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/jobs
// @desc    Get all jobs with filtering
// @access  Public (but can be filtered for private use)
router.get("/", auth, async (req, res) => {
  try {
    const { search, location, postedBy } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    // If the employer wants to see only their jobs
    if (postedBy === "me" && req.user.role === "employer") {
      query.postedBy = req.user.id;
    }

    const jobs = await Job.find(query).sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (Job Seeker)
router.post("/:id/apply", [auth, checkRole("jobseeker")], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: req.params.id,
      applicant: req.user.id,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ msg: "You have already applied for this job" });
    }

    const newApplication = new Application({
      job: req.params.id,
      applicant: req.user.id,
    });

    await newApplication.save();
    res.json({ msg: "Application successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/jobs/:id/applicants
// @desc    Get all applicants for a job
// @access  Private (Employer)
router.get(
  "/:id/applicants",
  [auth, checkRole("employer")],
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ msg: "Job not found" });
      }
      // Ensure the person requesting is the one who posted the job
      if (job.postedBy.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      const applications = await Application.find({
        job: req.params.id,
      }).populate("applicant", ["name", "email"]);

      // We could also fetch and attach profile summaries here if needed
      res.json(applications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
