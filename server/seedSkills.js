// routes/api/skills.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Skill = require("../../models/Skill");

// @route   GET api/skills
// @desc    Get skills with search query for suggestions
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const skills = await Skill.find(query).limit(10).sort({ name: 1 });
    res.json(skills.map((s) => s.name));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/skills
// @desc    Add a new skill if it doesn't exist
// @access  Private
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Skill name is required" });
  }
  try {
    // Find or create the skill, case-insensitively
    let skill = await Skill.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (skill) {
      return res.json(skill); // Return existing skill
    }
    skill = new Skill({ name: name.trim() });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      // Handle duplicate key error gracefully
      return res.status(400).json({ msg: "Skill already exists." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
