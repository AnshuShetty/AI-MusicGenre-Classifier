import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import '../admindashboard/admindashboard.css';
import api from "../../api";
import { logout } from "../../auth";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const [musicList, setMusicList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    album: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
    fetchMusicList();
  }, []);

  const fetchMusicList = async () => {
    try {
      const response = await api.get("http://localhost:5000/api/music/list");
      setMusicList(response.data);
    } catch (error) {
      console.error("Error fetching music list:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenreClassification = async () => {
    if (!file) {
      setError("Please upload a music file.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await api.post("http://127.0.0.1:7000/predict", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, genre: response.data.genre });
      setError("");
    } catch (err) {
      console.error("Error classifying genre:", err);
      setError("Failed to classify the genre. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.genre) {
      setError("Genre is required. Please classify the genre first.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    data.append("album", formData.album);
    data.append("genre", formData.genre);

    try {
      const response = await api.post("http://localhost:5000/api/music/upload", data);
      setMessage(response.data.message);
      fetchMusicList();
      // Clear the input fields after successful upload
    setFormData({
      title: "",
      artist: "",
      genre: "",
      album: "",
    });
    setFile(null); // Clear the file input
      setError("");
    } catch (error) {
      console.error("Error uploading music:", error.response?.data || error.message);
      setMessage("Error uploading music");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`http://localhost:5000/api/music/${id}`);
      setMusicList(musicList.filter((music) => music._id !== id));
      alert("Music deleted successfully!");
    } catch (error) {
      console.error("Error deleting music:", error);
      alert("An error occurred while deleting music.");
    }
  };

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
      <div className="admin-container">
        <div className="header">
        <h1 className="heading">Admin Dashboard</h1>
        </div>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="artist">Artist</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="album">Album</label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="input-field"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Music File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="input-field"
              required
            />
          </div>
          <button type="button" onClick={handleGenreClassification} className="upload-button">
            {loading ? "Classifying..." : "Classify Genre"}
          </button>
          <button type="submit" className="upload-button">
            Upload Music
          </button>
        </form>

        <h2 className="uploaded-music-heading">Uploaded Music</h2>
        <table className="music-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Genre</th>
              <th>Album</th>
              <th>Uploaded Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {musicList.map((music) => (
              <tr key={music._id}>
                <td>{music.title}</td>
                <td>{music.artist}</td>
                <td>{music.genre}</td>
                <td>{music.album}</td>
                <td>
                  {music.uploadedAt
                    ? new Date(music.uploadedAt).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(music._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="popular-genres">Popular Genres</h2>
      <div className="genre-links">
        <Link to="/dashboard/blues" className="genre-link genre-bollywood">Blues</Link>
        <Link to="/dashboard/disco" className="genre-link genre-romantic">Disco</Link>
        <Link to="/dashboard/hiphop" className="genre-link genre-hiphop">Hip-Hop</Link>
        <Link to="/dashboard/pop" className="genre-link genre-pop">Pop</Link>
        <Link to="/dashboard/rock" className="genre-link genre-rock">Rock</Link>
      </div>
      <div className="row">
      <div className="genre-links">
        <Link to="/dashboard/metal" className="genre-link genre-hiphop">Metal</Link>
        <Link to="/dashboard/Electronic" className="genre-link genre-electronic">Electronic</Link>
        {/* <Link to="/dashboard/bollypop" className="genre-link genre-bollywood">BollyPop</Link> */}
        {/* <Link to="/dashboard/rock" className="genre-link genre-rock">Rock</Link> */}
        <Link to="/dashboard/jazz" className="genre-link genre-electronic">Jazz</Link>
        <Link to="/dashboard/carnatic" className="genre-link genre-romantic">Carnatic</Link>
        <Link to="/dashboard/country" className="genre-link genre-pop">Country</Link>
      </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;
