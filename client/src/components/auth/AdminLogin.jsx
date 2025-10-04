import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "admin@jobconnect.com",
    password: "",
  });
  const [error, setError] = useState("");
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/users/login", formData);
      if (res.data.userType !== "admin") {
        setError("Authentication failed. This is not an admin account.");
        return;
      }
      onLoginSuccess(res.data.token, res.data.userType);
    } catch (err) {
      console.error(err.response ? err.response.data : "An error occurred");
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Sign In</h2>
      <p
        style={{
          color: "#6c757d",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Ensure the admin account has been created by running <br />
        <code>npm run seed:admin</code> in the server directory.
      </p>
      <form onSubmit={onSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
