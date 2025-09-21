import React, { useState } from "react";
import axios from "axios";
import '../components/genreclassifier.css';
import axiosInstance from "../utils/axiosInstance";

const GenreClassifier = () => {
  const [file, setFile] = useState(null); // For storing selected file
  const [genre, setGenre] = useState(""); // For storing predicted genre
  const [error, setError] = useState(""); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setGenre(""); // Clear genre when new file is selected
    setError(""); // Clear error messages
  };

  // Handle file upload and send it to Flask
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a music file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:7000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setGenre(response.data.genre); // Set the predicted genre
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to classify the genre. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="genre-classifier">
      <h2>Upload Music to Classify Genre</h2>
  
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Classifying..." : "Upload and Classify"}
      </button>
  
      {error && <p className="error">{error}</p>}
      {genre && <p className="result">Predicted Genre: {genre}</p>}
    </div>
  );
  
};

export default GenreClassifier;
