// routes/api/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const EmployerProfile = require("../../models/EmployerProfile");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({ name, email, password, role });

    // Set employer accounts to pending for admin approval
    if (role === "employer") {
      user.status = "pending";
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // If employer, create a default profile and don't issue token.
    if (user.role === "employer") {
      // Create a basic employer profile so they appear in admin dashboard
      const profileFields = {
        user: user.id,
        companyName: name, // Use the registration name as default company name
      };
      const employerProfile = new EmployerProfile(profileFields);
      await employerProfile.save();

      return res.json({
        msg: "Employer account registered. It is now pending admin approval.",
      });
    }

    // For jobseekers, issue token and log them in
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) {
          console.error("JWT Token Signing Error on register:", err.message);
          return res
            .status(500)
            .json({
              errors: [{ msg: "Server error during token generation." }],
            });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({
          errors: [
            {
              msg: "Account is not active. It may be pending approval or has been deactivated.",
            },
          ],
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        // CRITICAL FIX: Handle error inside the callback. `throw err` would crash the server.
        if (err) {
          console.error("JWT Token Signing Error on login:", err.message);
          // Check for missing secret key, a common configuration error
          if (err.message && err.message.includes("secretOrPrivateKey")) {
            return res
              .status(500)
              .json({
                errors: [{ msg: "Server configuration error prevents login." }],
              });
          }
          return res
            .status(500)
            .json({ errors: [{ msg: "Server error during authentication." }] });
        }
        res.json({ token, userType: user.role });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    // Ensure all server errors return a consistent JSON format
    res
      .status(500)
      .json({
        errors: [{ msg: "A server error occurred. Please try again later." }],
      });
  }
});

module.exports = router;
