import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = ({ navigate }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { "x-auth-token": token } };
        const res = await axios.get("/api/admin/employers", config);
        setProfiles(res.data);
      } catch (err) {
        console.error("Failed to fetch employer profiles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerProfiles();
  }, []);

  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Admin Dashboard - Employer Profiles</h2>
      </div>
      {profiles.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Contact Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile._id}>
                <td>{profile.companyName}</td>
                <td>{profile.user.name}</td>
                <td>{profile.user.email}</td>
                <td>
                  <span
                    className={`status-badge status-${capitalize(
                      profile.user.status
                    )}`}
                  >
                    {capitalize(profile.user.status)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      navigate("adminViewEmployer", { profileId: profile._id })
                    }
                    className="btn btn-secondary"
                  >
                    View/Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employer profiles found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
