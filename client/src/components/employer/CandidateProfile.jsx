import React, { useState, useEffect } from "react";
import axios from "axios";

const CandidateProfile = ({ userId, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get(`/api/profile/user/${userId}`, config);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

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
  if (!profile)
    return (
      <div>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ marginBottom: "1rem" }}
        >
          &larr; Back to Applicants
        </button>
        <p>This user has not created a profile yet.</p>
      </div>
    );

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
      <button
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Applicants
      </button>
      <div className="details-view">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          {photo && (
            <img
              src={photo}
              alt="Profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "1.5rem",
              }}
            />
          )}
          <div>
            <h2>{user.name}</h2>
            <h4>{user.email}</h4>
          </div>
        </div>

        {resume && (
          <a
            href={resume}
            download={`${user.name.replace(/\s+/g, "_")}-resume.pdf`}
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
            <strong>Location:</strong> {location || "N/A"}
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
                <strong>{edu.qualification}</strong> - {edu.degree || "N/A"}
              </p>
              <p>
                {edu.school}, Passed out in {edu.passingYear}
              </p>
            </div>
          ))}
        </div>

        <div className="details-section">
          <h5>Work Experience</h5>
          {experience.map((exp, index) => (
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
                    {exp.currentSalary ? `₹${exp.currentSalary}/month` : "N/A"}
                  </p>
                  <p>
                    <strong>Skills:</strong> {exp.skills?.join(", ")}
                  </p>
                </div>
              ) : (
                <p>Fresher</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
