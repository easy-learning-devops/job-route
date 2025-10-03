import React from "react";

const Header = ({ isAuthenticated, userType, onLogout, navigate }) => {
  const goHome = () => {
    if (!isAuthenticated) {
      navigate("landing");
      return;
    }
    if (userType === "admin") {
      navigate("adminDashboard");
    } else if (userType === "employer") {
      navigate("myJobs");
    } else {
      navigate("jobs");
    }
  };

  return (
    <header>
      <div className="container">
        <h1 onClick={goHome}>JobConnect</h1>
        <nav>
          {isAuthenticated && userType === "jobseeker" && (
            <>
              <button
                onClick={() => navigate("jobs")}
                className="btn btn-outline"
              >
                Find Jobs
              </button>
              <button
                onClick={() => navigate("viewProfile")}
                className="btn btn-outline"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate("myApplications")}
                className="btn"
              >
                My Applications
              </button>
            </>
          )}
          {isAuthenticated && userType === "employer" && (
            <>
              <button
                onClick={() => navigate("employerProfile")}
                className="btn btn-outline"
              >
                Company Profile
              </button>
              <button
                onClick={() => navigate("myJobs")}
                className="btn btn-outline"
              >
                My Jobs
              </button>
              <button onClick={() => navigate("postJob")} className="btn">
                Post a Job
              </button>
            </>
          )}
          {isAuthenticated && userType === "admin" && (
            <button
              onClick={() => navigate("adminDashboard")}
              className="btn btn-outline"
            >
              Admin Dashboard
            </button>
          )}
          {isAuthenticated && (
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
