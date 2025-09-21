import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './favorities.css'
import Navbar from '../../components/Navbar';
import play from '../../assets/play.png';
import pause from '../../assets/pause.png';

const Favorites = ({ favoritesCount, togglePlayPause }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle (remove) a favorite
  const toggleFavorite = (song) => {
    const updatedFavorites = favorites.filter(fav => fav.fileUrl !== song.fileUrl);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <>
    <Navbar favoritesCount={favorites.length}/>
    <div className="favorites-container">
      <div className="fav-header">
      <h2>Favorite Songs ({favorites.length})</h2>

      </div>
      <div className="song-container">

      {favorites.length === 0 ? (
        <p>No favorite songs yet.</p>
      ) : (
        <table className="music-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Genre</th>
          <th>Album</th>
          <th>Like</th>
        </tr>
      </thead>
      <tbody>
        {favorites.map((song, index) => (
          <tr key={index}>
            <td>{song.title}</td>
            <td>{song.artist}</td>
            <td>{song.genre}</td>
            <td>{song.album}</td>
            {/* <td>
               <button
                                    className="playpause"
                                    onClick={() => togglePlayPause(`http://localhost:5000${music.fileUrl}`, index)}
                                  >
                                    {isPlaying && currentTrackIndex === index ? (
                                      <img src={pause} />
                                    ) : (
                                      <img src={play} />
                                    )}
                                  </button>
            </td> */}
            <td>
              <i
                className="fa-solid fa-heart"
                onClick={() => toggleFavorite(song)}
                style={{ color: 'red', cursor: 'pointer' }}
              ></i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      )}
      </div>
    </div>
    </>
  );
};

export default Favorites;
