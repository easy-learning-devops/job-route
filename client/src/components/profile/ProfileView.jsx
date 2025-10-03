import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileView = ({ navigate }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get("/api/profile/me", config);
        setProfile(res.data);
      } catch (err) {
        console.log("No profile found for user.");
        setProfile(null); // Explicitly set to null if not found
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) return <div>Loading profile...</div>;

  if (!profile) {
    return (
      <div className="details-view" style={{ textAlign: "center" }}>
        <h2>Welcome!</h2>
        <p>
          You haven't created a profile yet. A complete profile helps you get
          noticed by employers.
        </p>
        <button
          onClick={() => navigate("profile")}
          className="btn"
          style={{ marginTop: "1rem" }}
        >
          Create Your Profile
        </button>
      </div>
    );
  }

  const {
    user,
    dob,
    gender,
    location,
    education,
    experience,
    resume,
    preferredLocations,
    englishProficiency,
    languagesKnown,
    photo,
  } = profile;

  return (
    <div>
      <div className="page-header">
        <h2>My Profile</h2>
        <button onClick={() => navigate("profile")} className="btn">
          Edit Profile
        </button>
      </div>
      <div className="details-view">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "1.5rem",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "1.5rem",
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: "2rem",
              }}
            >
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <h2>{user.name}</h2>
            <h4>{user.email}</h4>
          </div>
        </div>

        {resume && (
          <a
            href={resume}
            download="My-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ marginBottom: "1rem" }}
          >
            Download Resume
          </a>
        )}

        <div className="details-section">
          <h5>Personal Details</h5>
          <p>
            <strong>Age:</strong> {calculateAge(dob)}
          </p>
          <p>
            <strong>Gender:</strong> {gender || "N/A"}
          </p>
          <p>
            <strong>Current Location:</strong> {location || "N/A"}
          </p>
          <p>
            <strong>Preferred Locations:</strong>{" "}
            {preferredLocations?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>English Proficiency:</strong> {englishProficiency || "N/A"}
          </p>
          <p>
            <strong>Languages Known:</strong>{" "}
            {languagesKnown?.join(", ") || "N/A"}
          </p>
        </div>

        <div className="details-section">
          <h5>Education</h5>
          {education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <p>
                <strong>{edu.qualification}</strong>{" "}
                {edu.degree && ` - ${edu.degree}`}
              </p>
              <p>
                {edu.school}, Passed out in {edu.passingYear}
              </p>
            </div>
          ))}
        </div>

        <div className="details-section">
          <h5>Work Experience</h5>
          {experience &&
            experience.map((exp, index) => (
              <div key={index}>
                {exp.isExperienced ? (
                  <div
                    style={{
                      borderLeft: "3px solid var(--primary-color)",
                      paddingLeft: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <p>
                      <strong>Total Experience:</strong> {exp.totalYears} years
                    </p>
                    <h6
                      style={{
                        marginTop: "1rem",
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      Latest Role
                    </h6>
                    <p>
                      <strong>Title:</strong> {exp.jobTitle} at {exp.company}
                    </p>
                    <p>
                      <strong>Industry:</strong> {exp.industry}
                    </p>
                    <p>
                      <strong>Department:</strong> {exp.department} (
                      {exp.roleCategory})
                    </p>
                    <p>
                      <strong>Experience in this role:</strong>{" "}
                      {exp.roleExperienceYears} years
                    </p>
                    <p>
                      <strong>Current Salary:</strong>{" "}
                      {exp.currentSalary
                        ? `₹${exp.currentSalary}/month`
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Skills:</strong> {exp.skills?.join(", ")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p>
                      <strong>Fresher</strong>
                    </p>
                    <p>
                      <strong>Skills:</strong> {exp.skills?.join(", ") || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
