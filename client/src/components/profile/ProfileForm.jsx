import React, { useState, useEffect } from "react";
import axios from "axios";

const initialFormData = {
  photo: "",
  dob: "",
  gender: "",
  location: "",
  preferredLocations: "",
  education: [{ qualification: "", degree: "", school: "", passingYear: "" }],
  experience: [
    {
      isExperienced: null,
      totalYears: "",
      jobTitle: "",
      company: "",
      currentSalary: "",
      department: "",
      roleCategory: "",
      skills: "",
      industry: "",
      roleExperienceYears: "",
    },
  ],
  englishProficiency: "",
  languagesKnown: "",
  resume: "",
};

const ProfileForm = ({ onProfileComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get("/api/profile/me", config);
        const profileData = res.data;

        // Pre-fill user's name from the populated user object
        if (profileData.user && profileData.user.name) {
          setUserName(profileData.user.name);
        }

        const formattedData = {
          ...initialFormData,
          ...profileData,
          dob: profileData.dob
            ? new Date(profileData.dob).toISOString().split("T")[0]
            : "",
          preferredLocations: profileData.preferredLocations?.join(", ") || "",
          languagesKnown: profileData.languagesKnown?.join(", ") || "",
          education: profileData.education?.length
            ? profileData.education
            : initialFormData.education,
          experience: profileData.experience?.length
            ? profileData.experience.map((exp) => ({
                ...exp,
                skills: exp.skills?.join(", ") || "",
              }))
            : initialFormData.experience,
        };

        setFormData(formattedData);
      } catch (err) {
        console.log("No profile found, creating a new one.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (e, index, section, field) => {
    const newSectionData = [...formData[section]];
    let value = e.target.value;
    if (field === "isExperienced") {
      value = value === "true";
    }
    newSectionData[index][field] = value;
    setFormData({ ...formData, [section]: newSectionData });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result }); // result is base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        e.target.value = null;
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        // 3MB
        alert("File size should be less than 3MB.");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, resume: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Manual validation for the last step
    if (step === 3) {
      if (
        !formData.englishProficiency ||
        !formData.preferredLocations.trim() ||
        !formData.languagesKnown.trim()
      ) {
        alert("Please fill out all required fields before saving.");
        return;
      }
      // Resume is required only for new profiles
      if (!formData._id && !formData.resume) {
        alert("Please upload your resume to complete your profile.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      const payload = {
        ...formData,
        preferredLocations: formData.preferredLocations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        languagesKnown: formData.languagesKnown
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: formData.experience.map((exp) => ({
          ...exp,
          skills:
            typeof exp.skills === "string"
              ? exp.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : exp.skills,
        })),
      };

      await axios.post("/api/profile", payload, config);
      alert(
        formData._id
          ? "Profile Updated Successfully!"
          : "Profile Saved Successfully!"
      );
      onProfileComplete();
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert(
        "Failed to save profile. The server might be busy, please try again."
      );
    }
  };

  if (loading) return <div>Loading profile...</div>;

  const renderStepOne = () => (
    <div>
      <h3 className="form-section-header">
        Step 1: Personal & Education Details
      </h3>
      <div className="form-group">
        <label>Profile Photo</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handlePhotoChange}
        />
        <p className="field-hint">Upload a professional headshot. (Max 2MB)</p>
        {formData.photo && (
          <img
            src={formData.photo}
            alt="preview"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: "10px",
            }}
          />
        )}
      </div>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={userName} disabled />
        <p className="field-hint">Name cannot be changed here.</p>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={onChange}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Third Gender">Third Gender</option>
          </select>
        </div>
      </div>
      <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Education</h4>
      <div className="form-group">
        <label>Highest Qualification</label>
        <select
          name="qualification"
          value={formData.education[0].qualification}
          onChange={(e) =>
            handleArrayChange(e, 0, "education", "qualification")
          }
        >
          <option value="">Select...</option>
          <option value="Less Than Tenth">Less Than Tenth</option>
          <option value="Tenth">Tenth</option>
          <option value="Twelfth and Above">Twelfth and Above</option>
          <option value="Graduate and above">Graduate and above</option>
        </select>
      </div>
      <div className="form-group">
        <label>Degree</label>
        <input
          type="text"
          name="degree"
          value={formData.education[0].degree}
          onChange={(e) => handleArrayChange(e, 0, "education", "degree")}
          placeholder="e.g., Bachelor of Technology"
        />
      </div>
      <div className="form-group">
        <label>College Name</label>
        <input
          type="text"
          name="school"
          value={formData.education[0].school}
          onChange={(e) => handleArrayChange(e, 0, "education", "school")}
          placeholder="e.g., Patna University"
        />
      </div>
      <div className="form-group">
        <label>Passing Year</label>
        <input
          type="number"
          name="passingYear"
          value={formData.education[0].passingYear}
          onChange={(e) => handleArrayChange(e, 0, "education", "passingYear")}
          placeholder="e.g., 2022"
        />
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div>
      <h3 className="form-section-header">Step 2: Work Experience</h3>
      <div className="form-group">
        <label>Do you have any work experience?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="isExperienced"
              value="true"
              checked={formData.experience[0].isExperienced === true}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "isExperienced")
              }
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="isExperienced"
              value="false"
              checked={formData.experience[0].isExperienced === false}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "isExperienced")
              }
            />{" "}
            No
          </label>
        </div>
      </div>

      {formData.experience[0].isExperienced === false && (
        <div className="form-group">
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.experience[0].skills}
            onChange={(e) => handleArrayChange(e, 0, "experience", "skills")}
            placeholder="e.g., Communication, Teamwork, MS Office"
          />
          <p className="field-hint">Enter skills separated by commas.</p>
        </div>
      )}

      {formData.experience[0].isExperienced === true && (
        <>
          <div className="form-group">
            <label>Total years of Experience</label>
            <input
              type="number"
              name="totalYears"
              value={formData.experience[0].totalYears}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "totalYears")
              }
            />
          </div>
          <h4>Latest Job Details</h4>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.experience[0].jobTitle}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "jobTitle")
              }
            />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.experience[0].company}
              onChange={(e) => handleArrayChange(e, 0, "experience", "company")}
            />
          </div>
          <div className="form-group">
            <label>Current Salary (per month)</label>
            <input
              type="number"
              name="currentSalary"
              value={formData.experience[0].currentSalary}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "currentSalary")
              }
            />
          </div>

          <h4 style={{ marginTop: "2rem" }}>
            Add more details about your role
          </h4>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.experience[0].department}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "department")
              }
              placeholder="e.g., Engineering"
            />
          </div>
          <div className="form-group">
            <label>Role Category</label>
            <input
              type="text"
              name="roleCategory"
              value={formData.experience[0].roleCategory}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "roleCategory")
              }
              placeholder="e.g., Software Development"
            />
          </div>
          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.experience[0].skills}
              onChange={(e) => handleArrayChange(e, 0, "experience", "skills")}
              placeholder="e.g., React, Node.js"
            />
            <p className="field-hint">Enter skills separated by commas.</p>
          </div>
          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.experience[0].industry}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "industry")
              }
              placeholder="e.g., Information Technology"
            />
          </div>
          <div className="form-group">
            <label>Experience in this Role (years)</label>
            <input
              type="number"
              name="roleExperienceYears"
              value={formData.experience[0].roleExperienceYears}
              onChange={(e) =>
                handleArrayChange(e, 0, "experience", "roleExperienceYears")
              }
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStepThree = () => (
    <div>
      <h3 className="form-section-header">Step 3: Preferences & Resume</h3>
      <div className="form-group">
        <label>
          English Proficiency <span className="required">*</span>
        </label>
        <select
          name="englishProficiency"
          value={formData.englishProficiency}
          onChange={onChange}
          required
        >
          <option value="">Select...</option>
          <option value="No English">No English</option>
          <option value="Thoda English">Thoda English</option>
          <option value="Good English">Good English</option>
          <option value="Fluent English">Fluent English</option>
        </select>
      </div>
      <div className="form-group">
        <label>
          Preferred Work Location(s) <span className="required">*</span>
        </label>
        <input
          type="text"
          name="preferredLocations"
          value={formData.preferredLocations}
          onChange={onChange}
          placeholder="e.g., Delhi, Mumbai, Bangalore"
          required
        />
        <p className="field-hint">Enter locations separated by commas.</p>
      </div>
      <div className="form-group">
        <label>
          Languages Known <span className="required">*</span>
        </label>
        <input
          type="text"
          name="languagesKnown"
          value={formData.languagesKnown}
          onChange={onChange}
          placeholder="e.g., Hindi, English, Maithili"
          required
        />
        <p className="field-hint">Enter languages separated by commas.</p>
      </div>
      <div className="form-group">
        <label>
          Upload Resume <span className="required">*</span>
        </label>
        <input
          type="file"
          name="resume"
          onChange={handleResumeChange}
          accept=".pdf"
          required={!formData.resume}
        />
        <p className="field-hint">
          {formData.resume && !formData.resume.startsWith("data:")
            ? "Resume is on file. Upload a new one to replace it."
            : "PDF only, less than 3MB."}
        </p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return renderStepOne();
    }
  };

  return (
    <form onSubmit={onSubmit} className="form-container">
      {renderStep()}
      <div
        className="form-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn btn-secondary"
            >
              Back
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={nextStep} className="btn">
              Next
            </button>
          )}
          {step === 3 && (
            <button type="submit" className="btn">
              Save Profile
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
