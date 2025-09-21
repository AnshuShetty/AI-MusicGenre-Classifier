import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for the sidebar

const Sidebar = ({ genres }) => {
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="sidebar">
      {/* Home Icon */}
      <div className="sidebar-item">
        <Link to="/" className="sidebar-link">
          
          Home
        </Link>
      </div>

      {/* Genre List */}
      <div className="sidebar-item">
        <h3 className="sidebar-title">Genres</h3>
        <ul className="genre-list">
          {genres.map((genre) => (
            <li key={genre} className="genre-item">
              <Link
                to={`/music/${genre}`}
                className={`genre-link ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Music Prediction Section */}
      <div className="music-prediction">
        <h3 className="sidebar-title">Predict Genre</h3>
        <input type="file" className="upload-input" />
        <button className="upload-button">
           Upload Music
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
