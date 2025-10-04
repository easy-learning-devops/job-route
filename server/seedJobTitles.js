// seedJobTitles.js
const mongoose = require("mongoose");
const JobTitle = require("./models/JobTitle");
require("dotenv").config();

const jobTitles = [
  "Account Executive",
  "Accountant",
  "Administrative Assistant",
  "Architect",
  "Backend Developer",
  "Business Analyst",
  "Chef",
  "Civil Engineer",
  "Content Writer",
  "Customer Support Representative",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Digital Marketing Specialist",
  "Doctor",
  "Electrician",
  "Financial Analyst",
  "Frontend Developer",
  "Full Stack Developer",
  "Graphic Designer",
  "HR Manager",
  "IT Support Specialist",
  "Lawyer",
  "Marketing Manager",
  "Mechanical Engineer",
  "Nurse",
  "Office Manager",
  "Operations Manager",
  "Plumber",
  "Product Manager",
  "Project Manager",
  "QA Engineer",
  "Recruiter",
  "Sales Representative",
  "Software Engineer",
  "Teacher",
  "UI/UX Designer",
  "Web Developer",
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await JobTitle.deleteMany({});
    console.log("Existing job titles cleared.");

    const titlesToInsert = jobTitles.map((name) => ({ name }));
    await JobTitle.insertMany(titlesToInsert);

    console.log(
      `${jobTitles.length} job titles have been seeded successfully!`
    );
  } catch (err) {
    console.error("Error seeding job titles:", err);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDB();
