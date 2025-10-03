// seed.js
const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const jobs = [
    {
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        description: 'Developing and maintaining user-facing features for our web applications.',
        salary: '$120,000 - $150,000'
    },
    {
        title: 'Backend Engineer',
        company: 'Data Systems LLC',
        location: 'New York, NY',
        description: 'Design and implement scalable backend services and APIs.',
        salary: '$130,000 - $160,000'
    },
    {
        title: 'Full Stack Engineer',
        company: 'Creative Innovations',
        location: 'Austin, TX',
        description: 'Work on both frontend and backend parts of our platform.',
        salary: '$125,000 - $155,000'
    },
    {
        title: 'UI/UX Designer',
        company: 'Pixel Perfect Designs',
        location: 'Remote',
        description: 'Create intuitive and visually appealing user interfaces.',
        salary: '$100,000 - $130,000'
    }
];

const seedDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Job.deleteMany({});
    await Job.insertMany(jobs);
    console.log('Database seeded!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
