// routes/api/applications.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const Application = require("../../models/Application");
const Job = require("../../models/Job");

// @route   GET api/applications/me
// @desc    Get all applications for the logged-in job seeker
// @access  Private (Job Seeker)
router.get("/me", [auth, checkRole("jobseeker")], async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", ["title", "companyName"])
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer)
router.put(
  "/:id/status",
  [auth, checkRole("employer", "admin")],
  async (req, res) => {
    const { status } = req.body;

    // Simple validation for status
    const allowedStatuses = ["Applied", "Viewed", "Shortlisted", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ msg: "Application not found" });
      }

      const job = await Job.findById(application.job);
      if (!job) {
        return res.status(404).json({ msg: "Associated job not found" });
      }

      // Check if the user updating the status is the one who posted the job or an admin
      if (
        req.user.role !== "admin" &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      application.status = status;
      await application.save();

      // Return the updated application, populated with applicant info
      const updatedApplication = await Application.findById(
        req.params.id
      ).populate("applicant", ["name", "email"]);
      res.json(updatedApplication);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Application not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
