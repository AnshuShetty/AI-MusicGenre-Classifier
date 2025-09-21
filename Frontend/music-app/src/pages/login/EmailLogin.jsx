import React from 'react'
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/melodia.png"
import '../login/login.css';

const EmailLogin = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(""); // To capture error messages from backend
    const [loading, setLoading] = useState(false); // To show loading spinner or disable buttons while submitting
    const [emailOnly, setEmailOnly] = useState("");
    const navigate = useNavigate();
    

    const handleEmailLogin = async(e)=>{
        e.preventDefault();
        if(!emailOnly){
          return setError("Please enter your Email.");
        }
        try{
          setLoading(true);
          await axios.post("http://localhost:5000/api/auth/request-code", { email: emailOnly });
          navigate("/verify-code", {state: { email: emailOnly }});
        }
        catch(err){
          setError(err.response?.data?.error || "Failed to send verification code");
        }
        finally {
          setLoading(false);
        }
      }

  return (
    <div className="login-page-container">


    <div className="email-login-section">
      <img
                src={Logo}
                alt="Music App"
                className="app-logo"
      />
        <form onSubmit={handleEmailLogin}>

          {/* <label htmlFor="email">Email</label> */}
          <input
            type="email"
            placeholder="Enter your email"
            value={emailOnly}
            onChange={(e) => setEmailOnly(e.target.value)}
          />
          <button className="login-button email-btn" disabled={loading}>
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}

    </div>
    </div>
  )
}

export default EmailLogin