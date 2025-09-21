import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const PhoneLogin = () => {
    const [email, setEmail] = useState("");
        const [error, setError] = useState(""); // To capture error messages from backend
        const [loading, setLoading] = useState(false); // To show loading spinner or disable buttons while submitting
        const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState("");

    const handleOtpSend = async (e) => {
  e.preventDefault();

  if (!phoneNumber) {
    return setError("Please enter your phone number.");
  }

  try {
    setLoading(true);
    await axios.post("http://localhost:5000/api/auth/request-phone-otp", {
      phone: phoneNumber
    });

    navigate("/verify-phone", { state: { phone: phoneNumber } });
  } catch (err) {
    setError(err.response?.data?.error || "Failed to send OTP to phone");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page-container">

    <div className="email-login-section">
        <form onSubmit={handleOtpSend}>
  <label htmlFor="phone">Phone Number</label>
  <input
    type="tel"
    placeholder="Enter your phone number"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
  />
  <button className="login-button phone-btn" disabled={loading}>
    {loading ? "Sending OTP..." : "Continue"}
  </button>
</form>

        {error && <p className="error-message">{error}</p>}

    </div>
    </div>
  )
}

export default PhoneLogin