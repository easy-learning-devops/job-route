// seedAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const ADMIN_EMAIL = "admin@jobconnect.com";
const ADMIN_PASSWORD = "password123";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if an admin user already exists
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (adminUser) {
      console.log("Admin user already exists.");
      return;
    }

    // If no admin user, create one
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    adminUser = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
  } catch (err) {
    console.error("Error seeding admin user:", err.message);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedAdmin();
