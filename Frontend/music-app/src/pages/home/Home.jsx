import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../utils/axiosInstance";
import play from "../../assets/play.png";
import pause from "../../assets/pause.png";
import { useNavigate, Link } from "react-router-dom";
import Player from "../../components/Player";
import '../home/home.css'
import GenreClassifier from "../../components/Genreclassifier";
import { logout } from "../../auth";
import api from "../../api";

const Home = () => {
  const [musicList, setMusicList] = useState([]);
  const [audio, setAudio] = useState(null); // State to store the audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to track if the audio is playing
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null); // State to store the index of the current track
  const [favorites, setFavorites] = useState(() => {
  // Load from localStorage on first render
  const stored = localStorage.getItem("favorites");
  return stored ? JSON.parse(stored) : [];
});

  const toggleFavorite = (music) => {
  const isAlreadyFavorite = favorites.some(fav => fav.fileUrl === music.fileUrl);
  let updatedFavorites;

  if (isAlreadyFavorite) {
    updatedFavorites = favorites.filter(fav => fav.fileUrl !== music.fileUrl);
  } else {
    updatedFavorites = [...favorites, music];
  }

  setFavorites(updatedFavorites);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist
};


  const navigate = useNavigate();

  useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = async () => {
    try {
      const response = await api.get("http://localhost:5000/api/music/all", {
        withCredentials: true,
      });
      setMusicList(response.data);
    } catch (error) {
      console.error("Error fetching music list:", error);
    }
  };

  const togglePlayPause = (fileUrl, index) => {
    // If the song that is clicked is the same as the current one
    if (audio && audio.src === fileUrl) {
      if (isPlaying) {
        audio.pause();  // Pause the song
        setIsPlaying(false);  // Update the state to reflect paused status
      } else {
        audio.play();  // Play the song
        setIsPlaying(true);  // Update the state to reflect playing status
      }
    } else {
      // If a different song is clicked
      if (audio) {
        audio.pause();  // Pause the current song if it's playing
      }
      const newAudio = new Audio(fileUrl);  // Create a new audio element for the new song
      newAudio.play();  // Start playing the new song immediately
      setAudio(newAudio);  // Set the new audio element in state
      setCurrentTrackIndex(index);  // Update the current track index
      setIsPlaying(true);  // Mark as playing
    }
  };

  const playNextTrack = () => {
    if (currentTrackIndex < musicList.length - 1) {
      const nextTrackIndex = currentTrackIndex + 1;
      const nextTrack = musicList[nextTrackIndex];
      togglePlayPause(`http://localhost:5000${nextTrack.fileUrl}`, nextTrackIndex);
    }
  };

  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      const prevTrackIndex = currentTrackIndex - 1;
      const prevTrack = musicList[prevTrackIndex];
      togglePlayPause(`http://localhost:5000${prevTrack.fileUrl}`, prevTrackIndex);
    }
  };

  const currentMusic = musicList[currentTrackIndex];

  // Function to extract the first two letters from the title
  const getTitleSnippet = (title) => {
    return title.slice(0, 2).toUpperCase(); // Extract first 2 letters and convert to uppercase
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const timer = setTimeout(() => {
      logout();
    }, 60 * 1000); // 1 minute

    return () => clearTimeout(timer); // clean up
  }
}, []);



  return (
    <>
      <Navbar favoritesCount={favorites.length} togglePlayPause={togglePlayPause}/>
      <div className="home-container">
        <div className="header">
          <p>Today's Special</p>
        </div>
        <div className="all-musics">
          <table className="music-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Album</th>
                <th>Play</th>
              </tr>
            </thead>
            <tbody>
              {musicList.map((music, index) => (
                <tr key={music._id}>
                  <td>{music.title}</td>
                  <td>{music.artist}</td>
                  <td>{music.genre}</td>
                  <td>{music.album}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="genres-heading">Popular genres</h2>
        <div className="genre-links">
          <Link to="/dashboard/Bollywood" className="genre-link genre-bollywood">Bollywood</Link>
          <Link to="/dashboard/bolly_romantic" className="genre-link genre-romantic">Romantic</Link>
          <Link to="/dashboard/hiphop" className="genre-link genre-hiphop">Hip-Hop</Link>
          <Link to="/dashboard/pop" className="genre-link genre-pop">Pop</Link>
          <Link to="/dashboard/rock" className="genre-link genre-rock">Rock</Link>
          <Link to="/dashboard/blues" className="genre-link genre-electronic">Blues</Link>
        </div>

        <div className="row">
          <div className="genre-links">
            <Link to="/dashboard/semiclassical" className="genre-link genre-hiphop">Semiclassical</Link>
            <Link to="/dashboard/bollypop" className="genre-link genre-bollywood">BollyPop</Link>
            <Link to="/dashboard/gazal" className="genre-link genre-rock">Ghazal</Link>
            <Link to="/dashboard/sufi" className="genre-link genre-electronic">Sufi</Link>
            <Link to="/dashboard/carnatic" className="genre-link genre-romantic">Carnatic</Link>
            <Link to="/dashboard/metal" className="genre-link genre-pop">Metal</Link>
          </div>
        </div>

        {/* <div className="music-upload">
          <h2>Want to check the genre of the Music? Upload here.</h2>
          <button className="upload-button" onClick={() => alert("Upload Music functionality will be implemented soon!")}>
            Upload Music
          </button>
        </div> */}

        <GenreClassifier />

        <div className="song-boxes">
          {musicList.map((music, index) => (
            <div
              key={music._id}
              className="song-box"
              onClick={() => togglePlayPause(`http://localhost:5000${music.fileUrl}`, index)}
            >
              <div className="song-details">
                <div className="song-logo">
                  <span>{getTitleSnippet(music.title)}</span>
                </div>
                <h3>{music.title}</h3>
                <button>
                  {isPlaying && currentTrackIndex === index ? (
                    <img src={pause} alt="Pause" />
                  ) : (
                    <img src={play} alt="Play" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentMusic && (
          <Player
            musicData={currentMusic}
            isPlaying={isPlaying}
            onNext={playNextTrack}
            onPrev={playPreviousTrack}
            togglePlayPause={togglePlayPause}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </>
  );
};

export default Home;
