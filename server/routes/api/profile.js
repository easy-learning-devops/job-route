// routes/api/profile.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, checkRole("jobseeker"), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post("/", auth, checkRole("jobseeker"), async (req, res) => {
  // Destructure all possible fields from the form to ensure only valid data is processed
  const {
    photo,
    dob,
    gender,
    location,
    education,
    experience,
    englishProficiency,
    languagesKnown,
    resume,
    preferredLocations,
  } = req.body;

  // Build the profileFields object safely.
  const profileFields = {};
  profileFields.user = req.user.id;

  // Check if each property exists on the request body before adding it.
  if (req.body.hasOwnProperty("photo")) profileFields.photo = photo;
  if (req.body.hasOwnProperty("dob")) {
    // Ensure empty strings from the form are stored as null for Date fields.
    profileFields.dob = dob ? dob : null;
  }
  if (req.body.hasOwnProperty("gender")) profileFields.gender = gender;
  if (req.body.hasOwnProperty("location")) profileFields.location = location;
  if (req.body.hasOwnProperty("education")) profileFields.education = education;
  if (req.body.hasOwnProperty("experience"))
    profileFields.experience = experience;
  if (req.body.hasOwnProperty("englishProficiency"))
    profileFields.englishProficiency = englishProficiency;
  if (req.body.hasOwnProperty("languagesKnown"))
    profileFields.languagesKnown = languagesKnown;
  if (req.body.hasOwnProperty("resume")) profileFields.resume = resume;
  if (req.body.hasOwnProperty("preferredLocations"))
    profileFields.preferredLocations = preferredLocations;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get(
  "/user/:user_id",
  auth,
  checkRole("employer", "admin"),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id,
      }).populate("user", ["name", "email"]);
      if (!profile) {
        return res.status(400).json({ msg: "Profile not found" });
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(400).json({ msg: "Profile not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
