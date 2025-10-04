import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProfileForm from "./components/profile/ProfileForm";
import ProfileView from "./components/profile/ProfileView";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobList from "./components/JobList";
import EmployerAuth from "./components/auth/EmployerAuth";
import PostJobForm from "./components/employer/PostJobForm";
import JobDetails from "./components/JobDetails";
import MyJobs from "./components/employer/MyJobs";
import ApplicantList from "./components/employer/ApplicantList";
import CandidateProfile from "./components/employer/CandidateProfile";
import EmployerProfileForm from "./components/employer/EmployerProfileForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminEmployerDetails from "./components/admin/AdminEmployerDetails";
import MyApplications from "./components/jobseeker/MyApplications";
import AdminLogin from "./components/auth/AdminLogin";

function App() {
  const [page, setPage] = useState("landing");
  const [pageContext, setPageContext] = useState({}); // For passing IDs, etc.
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setUserType(storedUserType);

      if (storedUserType === "admin") {
        setPage("adminDashboard");
      } else if (storedUserType === "employer") {
        setPage("myJobs");
      } else {
        setPage("jobs");
      }
    }
  }, []);

  const handleLoginSuccess = (newToken, type) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userType", type);
    setToken(newToken);
    setUserType(type);
    setIsAuthenticated(true);

    if (type === "admin") {
      setPage("adminDashboard");
    } else if (type === "employer") {
      setPage("myJobs");
    } else {
      // Check for profile, for now just go to jobs
      setPage("jobs");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setToken(null);
    setIsAuthenticated(false);
    setUserType(null);
    setPage("landing");
  };

  const navigate = (newPage, context = {}) => {
    setPage(newPage);
    setPageContext(context);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (page) {
        case "register":
          return (
            <Register
              onRegisterSuccess={(token) =>
                handleLoginSuccess(token, "jobseeker")
              }
              showLogin={() => navigate("login")}
            />
          );
        case "login":
          return (
            <Login
              onLoginSuccess={handleLoginSuccess}
              showRegister={() => navigate("register")}
            />
          );
        case "adminLogin":
          return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
        case "employerAuth":
          return <EmployerAuth onLoginSuccess={handleLoginSuccess} />;
        case "landing":
        default:
          return (
            <LandingPage
              onWantJob={() => navigate("register")}
              onWantToHire={() => navigate("employerAuth")}
            />
          );
      }
    }

    // Authenticated routes
    switch (page) {
      case "viewProfile":
        return <ProfileView navigate={navigate} />;
      case "profile":
        return (
          <ProfileForm
            onProfileComplete={() => navigate("viewProfile")}
            onCancel={() => navigate("viewProfile")}
          />
        );
      case "jobs":
        return (
          <>
            <SearchBar />
            <JobList
              onViewDetails={(jobId) => navigate("viewJobDetails", { jobId })}
            />
          </>
        );
      case "viewJobDetails":
        return (
          <JobDetails
            jobId={pageContext.jobId}
            onBack={() => navigate("jobs")}
          />
        );
      case "myApplications":
        return <MyApplications navigate={navigate} />;

      // Employer pages
      case "employerProfile":
        return (
          <EmployerProfileForm onProfileSaved={() => navigate("myJobs")} />
        );
      case "myJobs":
        return (
          <MyJobs
            onViewApplicants={(jobId) => navigate("viewApplicants", { jobId })}
          />
        );
      case "postJob":
        return <PostJobForm onJobPosted={() => navigate("myJobs")} />;
      case "viewApplicants":
        return (
          <ApplicantList
            jobId={pageContext.jobId}
            onViewProfile={(userId) =>
              navigate("viewCandidateProfile", { userId })
            }
            onBack={() => navigate("myJobs")}
          />
        );
      case "viewCandidateProfile":
        return (
          <CandidateProfile
            userId={pageContext.userId}
            onBack={() =>
              navigate("viewApplicants", { jobId: pageContext.jobId })
            }
          />
        );

      // Admin pages
      case "adminDashboard":
        return <AdminDashboard navigate={navigate} />;
      case "adminViewEmployer":
        return (
          <AdminEmployerDetails
            profileId={pageContext.profileId}
            onBack={() => navigate("adminDashboard")}
          />
        );

      default:
        return (
          <LandingPage
            onWantJob={() => navigate("register")}
            onWantToHire={() => navigate("employerAuth")}
          />
        );
    }
  };

  return (
    <div className="container">
      <Header
        isAuthenticated={isAuthenticated}
        userType={userType}
        onLogout={handleLogout}
        navigate={navigate}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
