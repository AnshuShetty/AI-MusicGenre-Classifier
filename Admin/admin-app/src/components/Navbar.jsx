import React from "react";
import Logo from '../assets/melodia.png';
import '../components/navbar.css';

const Navbar = ({ isAuthenticated, adminName, onLogout }) => {
    return (
      <nav className="navbar">
        {/* Left Side: Logo */}
        <div className="navbar-logo">
          <a href="/" className="navbar-logo-link">
            <img
              src={Logo} // Replace with your logo path
              alt="Company Logo"
              className="navbar-logo-img"
            />
            Admin
          </a>
        </div>
  
        {/* Right Side: Admin Info and Button */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <p className="navbar-welcome-text">
                Welcome, <span className="navbar-admin-name">{adminName}</span>
              </p>
              <button
                onClick={onLogout}
                className="navbar-logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="navbar-login-button"
            >
              Login
            </a>
          )}
        </div>
      </nav>
    );
};
  

export default Navbar;
