// routes/api/employerProfile.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const EmployerProfile = require("../../models/EmployerProfile");

// @route   GET api/employer-profile/me
// @desc    Get current employer's profile
// @access  Private
router.get("/me", [auth, checkRole("employer")], async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({
      user: req.user.id,
    }).populate("user", ["name"]);
    if (!profile) {
      // Return a default structure if no profile exists yet
      return res.json({
        companyName: "",
        companyWebsite: "",
        companyDescription: "",
        address: "",
        organizationSize: "1-10",
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/employer-profile
// @desc    Create or update employer profile
// @access  Private
router.post("/", [auth, checkRole("employer")], async (req, res) => {
  const {
    companyName,
    companyWebsite,
    companyDescription,
    address,
    organizationSize,
  } = req.body;

  const profileFields = {
    user: req.user.id,
    companyName,
    companyWebsite,
    companyDescription,
    address,
    organizationSize,
  };

  try {
    let profile = await EmployerProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await EmployerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new EmployerProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
