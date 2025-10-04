import React, { useState } from "react";
import axios from "axios";

const EmployerAuth = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const url =
      authMode === "login" ? "/api/users/login" : "/api/users/register";
    const payload =
      authMode === "login"
        ? { email, password }
        : { name, email, password, role: "employer" };

    try {
      const res = await axios.post(url, payload);
      if (authMode === "login") {
        onLoginSuccess(res.data.token, res.data.userType); // Pass role from API on login
      } else {
        // On register, backend now sends a message for employers
        alert(
          res.data.msg ||
            "Registration successful! Your account is pending approval."
        );
        setAuthMode("login"); // Switch to login view after successful registration
      }
    } catch (err) {
      console.error(err.response.data);
      alert(
        `Authentication failed. ${
          err.response.data.errors
            ? err.response.data.errors[0].msg
            : "Please check your credentials."
        }`
      );
    }
  };

  return (
    <div className="form-container">
      <div className="auth-toggle">
        <button
          onClick={() => setAuthMode("login")}
          className={authMode === "login" ? "active" : ""}
        >
          Sign In
        </button>
        <button
          onClick={() => setAuthMode("register")}
          className={authMode === "register" ? "active" : ""}
        >
          Sign Up
        </button>
      </div>
      <h2>
        {authMode === "login" ? "Employer Login" : "Create Employer Account"}
      </h2>
      <form onSubmit={onSubmit}>
        {authMode === "register" && (
          <div className="form-group">
            <label htmlFor="name">
              Company/Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
        )}
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
          {authMode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default EmployerAuth;
