import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/melodia.png"
import '../login/login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To capture error messages from backend
  const [loading, setLoading] = useState(false); // To show loading spinner or disable buttons while submitting
  const [emailOnly, setEmailOnly] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous error

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password }, {withCredentials: true});
      // Store the token or handle the response as needed
      // Store the token and username in localStorage upon successful login
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role); // Save role to localStorage
      console.log(response.data); // Example: storing the token
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailredirect = async()=>{
   
      navigate("/email-login");
  
  }

  const handlePhoneRedirect = () =>{
    navigate("/phone-login");
  }

  return (
    <div className="login-page-container">
      <div className="login-box">
        <img
          src={Logo}
          alt="Music App"
          className="app-logo"
        />
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Loading..." : "SIGN IN"}
          </button>
          <p className="register-link">
        Don't have account? <a href="/register">CreateOne</a>
      </p>
        </form>

        <hr />
        <button className="other-logins" onClick={handleEmailredirect}>Login through Email</button>
        {/* <button className="other-logins" onClick={handlePhoneRedirect}>Login through Phone Number</button> */}
          <p className="register-link">Are you admin? <Link to="http://localhost:3001">Admin Login</Link></p>
      </div>
    </div>
  );
};

export default Login;
