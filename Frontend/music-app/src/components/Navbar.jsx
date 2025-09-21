import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../components/navbar.css';
import Logo from '../assets/melodia.png';
import settings from '../assets/settings.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = ({favoritesCount, togglePlayPause}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(""); // State for user role
  const navigate = useNavigate();

  // Check if the user is authenticated and fetch the role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role"); // Fetch user role

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setUserRole(storedRole); // Set the role in the state
    }
  }, []);

  const handleLogout = () => {
    // Remove token, username, and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Update the state to reflect the user is logged out
    setIsAuthenticated(false);
    setUsername("");
    setUserRole(""); // Reset the user role state

    // Optionally redirect the user to the home page
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>

      {/* Account Section */}
      <div className="account">
        Welcome, {username}
        <div className="AccountName">
          {isAuthenticated ? (
            <>
              <div className="fav">
                <Link to="/favorities">
                  Favorities ({favoritesCount})
                </Link>
                {/* <a href="/favorities">Favorites ({favoritesCount})</a> */}
              </div>
              {userRole === "admin" && (
                <Link to="http://localhost:3001/admin/selectGenre" className="btn admin-btn">
                 <img src={settings} alt="settings" /> Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn logout-btn"
              >
                Logout <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn login-btn"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
