import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SelectGenre.css'; // Make sure you have a CSS file for styling
import western_guitar from '../assets/guitar.jpeg';
import { logout } from "../auth";
import api from '../api.js';
import { jwtDecode } from "jwt-decode";

const SelectGenre = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    if (!token || role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

    useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const timer = setTimeout(() => {
        logout();
      }, 60 * 1000); // 1 minute
  
      return () => clearTimeout(timer); // clean up
    }
  }, []);

    useEffect(() => {
    const token = localStorage.getItem("adminToken");
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        const timeLeft = decoded.exp - currentTime;
  
        if (timeLeft <= 0) {
          logout(); // token already expired
        } else {
          const timer = setTimeout(() => {
            logout(); // auto logout after remaining time
          }, timeLeft * 1000);
  
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout(); // fallback logout
      }
    }
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} adminName={username} onLogout={handleLogout} />
    <div className="select-genre-container">
    <div className="header">
        <h1 className="heading">Admin Dashboard</h1>
        </div>
      <div className="genre-selection">
      <Link to="/admin/dashboardI" className="genre-box indian-genres">
          <img src="https://thumbs.dreamstime.com/b/exquisite-closeup-sitar-symphony-light-shadow-lowlight-indian-classical-music-photography-captivating-close-up-351446886.jpg" alt="" className="ind-clas-img" />
          <h3>Indian Genres</h3>
        </Link>
        <Link to="/admin/dashboard" className="genre-box indian-genres">
        <img src={western_guitar} alt="" className="ind-clas-img" />
          <h3>Western Genres</h3>
        </Link>
      </div>
    </div>
    </>
  );
};

export default SelectGenre;
