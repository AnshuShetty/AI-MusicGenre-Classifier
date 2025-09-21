import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../adminRegister/adminregister.css';
import Logo from "../../assets/melodia.png"

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(response.data.message);
      navigate("/"); // Redirect to login after successful registration
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-box">
      <img
          src={Logo}
          alt="Music App"
          className="app-logo"
        />
        <h2 className="register-title">Sign Up</h2>
        {error && <p className="register-error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form-fields">
          <div className="register-form-group">
            {/* <label className="register-label" htmlFor="username">
              Username
            </label> */}
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="register-input-field"
            />
          </div>
          <div className="register-form-group">
            {/* <label className="register-label" htmlFor="email">
              Email
            </label> */}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="register-input-field"
            />
          </div>
          <div className="register-form-group">
            {/* <label className="register-label" htmlFor="password">
              Password
            </label> */}
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="register-input-field"
            />
          </div>
          <div className="register-form-group">
            {/* <label className="register-label" htmlFor="role">
              Role
            </label> */}
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter your role"
              required
              className="register-input-field"
            />
          </div>
          <button type="submit" className="register-submit-button">
            Sign Up
          </button>
        </form>
        <p className="register-login-link">
          Already have an account?{" "}
          <a href="/admin/login" className="register-login-link-text">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );  
  
};

export default Signup;
