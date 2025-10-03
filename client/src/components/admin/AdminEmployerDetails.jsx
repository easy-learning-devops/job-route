import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminEmployerDetails = ({ profileId, onBack }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    address: "",
    organizationSize: "1-10",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get(
          `/api/admin/employers/${profileId}`,
          config
        );
        setFormData(res.data);
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch employer profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onUserChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };

      // Promise.all to send requests concurrently
      await Promise.all([
        axios.put(`/api/admin/employers/${profileId}`, formData, config),
        axios.put(
          `/api/admin/users/${user._id}/status`,
          { status: user.status },
          config
        ),
      ]);

      alert("Profile Updated Successfully!");
      onBack();
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <button
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: "1rem" }}
      >
        &larr; Back to Dashboard
      </button>
      <div className="form-container">
        <h2>Editing Profile for {user?.name}</h2>
        <form onSubmit={onSubmit} style={{ marginTop: "2rem" }}>
          <div className="form-group">
            <label htmlFor="companyName">
              Company Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyWebsite">Company Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={onChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyDescription">Company Description</label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Size of Organization</label>
            <select
              name="organizationSize"
              value={formData.organizationSize}
              onChange={onChange}
            >
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
              <option>201+</option>
            </select>
          </div>
          <div className="form-group">
            <label>Account Status</label>
            <select
              name="status"
              value={user ? user.status : "active"}
              onChange={onUserChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: "100%" }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEmployerDetails;
