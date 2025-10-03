# JobConnect (NaukriDO)

JobConnect is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to connect job seekers with employers. It provides a platform for employers to post job listings and for job seekers to find and apply for those jobs.

## Features

- **Dual User Roles**: Separate flows for Job Seekers and Employers.
- **User Authentication**: Secure JWT-based authentication for registration and login.
- **Job Seeker Features**:
  - Create and manage a detailed profile (personal info, education, experience).
  - Search and browse available jobs.
  - View job details and apply with a single click.
- **Employer Features**:
  - Post detailed job descriptions through a multi-step form.
  - View and manage their own job postings.
  - Review a list of applicants for each job.
  - View applicant profiles and download resumes.

## Technology Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (which includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community). You can either run a local MongoDB server or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- [Git](https://git-scm.com/) for cloning the repository.

---

## Local Installation and Setup

Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

Open your terminal and clone the project repository:

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Backend Setup

The backend server connects to the database and exposes the API endpoints.

a. **Navigate to the server directory**:
```bash
cd server
```

b. **Install dependencies**:
```bash
npm install
```

c. **Create Environment File**:
Create a `.env` file in the `server` directory. This file will store your secret keys and database connection string.

```bash
touch .env
```

d. **Configure Environment Variables**:
Open the `.env` file and add the following variables.

```env
# Your MongoDB connection string
# Replace with your own, e.g., mongodb://localhost:27017/jobconnect
MONGO_URI=your_mongodb_connection_string

# A secret key for signing JWT tokens
# You can use any long, random string
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup

The frontend is a React application that consumes the backend API.

a. **Navigate to the client directory from the root folder**:
```bash
cd client
```

b. **Install dependencies**:
```bash
npm install
```

The client `package.json` includes a `"proxy": "http://localhost:5000"` entry, which automatically forwards API requests from the React app to the backend server during development.

---

## Running the Application

You will need to run both the backend and frontend servers simultaneously in two separate terminals.

### 1. Run the Backend Server

- Navigate to the `server` directory.
- Run the following command to start the server with `nodemon`, which will automatically restart on file changes.

```bash
# In server/
npm run server
```
You should see a message confirming the server has started and connected to MongoDB:
```
Server started on port 5000
MongoDB Connected...
```

### 2. Run the Frontend Client

- Open a new terminal and navigate to the `client` directory.
- Run the following command:

```bash
# In client/
npm start
```
This will start the React development server, and your default web browser should automatically open to `http://localhost:3000`.

**You can now use the application!**

---

### (Optional) Seed the Database

If you want to populate the database with some initial sample job data for testing, you can run the seed script.

**Important**: Make sure your backend server is **not** running when you execute the seed script to avoid connection conflicts.

1.  Navigate to the project's root directory.
2.  Run the script:

```bash
node server/seed.js
```
You should see a confirmation message: `Database seeded!`
