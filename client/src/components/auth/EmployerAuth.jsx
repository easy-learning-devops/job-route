import React, { useState } from "react";
import axios from "axios";

const EmployerAuth = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const url =
      authMode === "login" ? "/api/users/login" : "/api/users/register";
    const payload =
      authMode === "login"
        ? { email, password }
        : { name, email, password, role: "employer" };

    try {
      if (authMode === "login") {
        const res = await axios.post(url, payload);
        if (res.data.userType !== "employer") {
          const userType =
            res.data.userType.charAt(0).toUpperCase() +
            res.data.userType.slice(1);
          setError(
            `This is not an employer account. Please use the ${userType} login page.`
          );
          return;
        }
        onLoginSuccess(res.data.token, res.data.userType);
      } else {
        const res = await axios.post(url, payload);
        // On register, backend now sends a message for employers
        alert(
          res.data.msg ||
            "Registration successful! Your account is pending approval."
        );
        switchMode("login"); // Switch to login view after successful registration
      }
    } catch (err) {
      console.error(err.response.data);
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        "Authentication failed. Please check your credentials.";
      setError(errorMsg);
    }
  };

  return (
    <div className="form-container">
      <div className="auth-toggle">
        <button
          onClick={() => switchMode("login")}
          className={authMode === "login" ? "active" : ""}
        >
          Sign In
        </button>
        <button
          onClick={() => switchMode("register")}
          className={authMode === "register" ? "active" : ""}
        >
          Sign Up
        </button>
      </div>
      <h2>
        {authMode === "login" ? "Employer Login" : "Create Employer Account"}
      </h2>
      <form onSubmit={onSubmit}>
        {error && <p className="error-message">{error}</p>}
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
