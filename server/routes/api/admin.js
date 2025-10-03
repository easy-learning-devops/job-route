// routes/api/admin.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkRole = require("../../middleware/checkRole");
const EmployerProfile = require("../../models/EmployerProfile");
const User = require("../../models/User");

// @route   GET api/admin/employers
// @desc    Get all employer profiles
// @access  Private (Admin)
router.get("/employers", [auth, checkRole("admin")], async (req, res) => {
  try {
    const profiles = await EmployerProfile.find().populate("user", [
      "name",
      "email",
      "date",
      "status",
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/admin/employers/:profile_id
// @desc    Get a specific employer profile by its own ID
// @access  Private (Admin)
router.get(
  "/employers/:profile_id",
  [auth, checkRole("admin")],
  async (req, res) => {
    try {
      const profile = await EmployerProfile.findById(
        req.params.profile_id
      ).populate("user", ["name", "email", "status"]);
      if (!profile) return res.status(404).json({ msg: "Profile not found" });
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/admin/employers/:profile_id
// @desc    Update an employer profile
// @access  Private (Admin)
router.put(
  "/employers/:profile_id",
  [auth, checkRole("admin")],
  async (req, res) => {
    const {
      companyName,
      companyWebsite,
      companyDescription,
      address,
      organizationSize,
    } = req.body;

    const profileFields = {
      companyName,
      companyWebsite,
      companyDescription,
      address,
      organizationSize,
    };

    try {
      let profile = await EmployerProfile.findById(req.params.profile_id);
      if (!profile) return res.status(404).json({ msg: "Profile not found" });

      profile = await EmployerProfile.findByIdAndUpdate(
        req.params.profile_id,
        { $set: profileFields },
        { new: true }
      ).populate("user", ["name", "email"]);
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/admin/users/:user_id/status
// @desc    Update a user's status by Admin
// @access  Private (Admin)
router.put(
  "/users/:user_id/status",
  [auth, checkRole("admin")],
  async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ["active", "inactive", "pending"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status provided" });
    }

    try {
      const user = await User.findById(req.params.user_id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.status = status;
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
