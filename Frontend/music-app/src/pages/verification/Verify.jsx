import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../login/login.css";


const Verify = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    if (!code || !email) {
      return setError("Invalid input");
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/verify-code", {
        email,
        code
      }, { withCredentials: true });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2 style={{ color: "white", marginBottom: "2rem"}}>Enter Verification Code</h2>

        <input style={{marginBottom: "2rem"}}
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleVerify} className="login-button" disabled={loading}>
          {loading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default Verify