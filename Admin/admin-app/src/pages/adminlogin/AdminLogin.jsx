import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../adminlogin/adminlogin.css';
import Logo from "../../assets/melodia.png"
import axiosInstance from '../../utils/axiosInstance'; // Import the pre-configured axios instance

const AdminLogin = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // To capture error messages from backend
  const [loading, setLoading] = useState(false); // To manage loading state during login request
  const navigate = useNavigate(); // Used for navigation after successful login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Sending POST request to the backend for login
      const response = await axios.post("http://localhost:5000/api/auth/admin/login", {
        username,
        password,
      }, {withCredentials:true});

      // Store the token in localStorage upon successful login
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("role", response.data.role); // Store role in localStorage
      localStorage.setItem("username", response.data.username);

      // Redirect to the admin dashboard
      navigate("/admin/selectGenre");

    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-page-container">
      <img
          src={Logo}
          alt="Music App"
          className="app-logo"
        />
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>} {/* Display error message */}
          <div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default AdminLogin;
