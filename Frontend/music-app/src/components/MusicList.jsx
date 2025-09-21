import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Player from './Player';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import '../components/musiclist.css';
import play from '../assets/play.png'
import pause from '../assets/pause.png'
import NoMusic from '../assets/music.svg';


const MusicList = ({favoritesCount}) => {
  const { genre } = useParams(); // Get the genre from the URL
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audio, setAudio] = useState(null); // State to manage audio playback
  const [isPlaying, setIsPlaying] = useState(false); // State to check if music is playing
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Track index of the current song
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState("");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    const storedFavorites = JSON.parse(localStorage.getItem('favorities')) || [];
    setFavorites(storedFavorites);
  })

  const genreBackgrounds = {
    Bollywood: 'linear-gradient(180deg, #ff2957, #000000)', // Bollywood gradient
    bolly_romantic: 'linear-gradient(180deg, #ff8c00, #000000)', // Romantic gradient
    hiphop: 'linear-gradient(135deg, #ff0080, #8a2be2)', // Hip-hop gradient
    pop: 'linear-gradient(135deg, #ff4500, #ff6347)', // Pop gradient
    rock: 'linear-gradient(180deg, #ff4500, #ff6347)', // rock gradient
    Electronic: 'linear-gradient(180deg, #ff4500, #000000)',
    bollypop: 'linear-gradient(180deg, #ff4480, #000000)',
    // hiphop: 'linear-gradient(180deg, #8607db, #000000)',
    jazz: 'linear-gradient(180deg,rgb(13, 38, 54), #000000)',
  };

  useEffect(() => {
      // Set the background based on the genre with a linear gradient fallback
      document.body.style.background = genreBackgrounds[genre] 
          ? `linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), ${genreBackgrounds[genre]}`
          : 'linear-gradient(180deg, rgba(0, 194, 10, 0.6), rgba(0, 0, 0, 0.3)), #121212'; // Fallback to dark with linear gradient
  }, [genre]); // Re-run effect when genre changes

  

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        // Fetch music by genre from the backend
        const response = await axios.get(`http://localhost:5000/api/music/albums/${genre}`, {
          withCredentials: true,
        });
        setMusicList(response.data); // Set the music list from the response
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [genre]); // Fetch music again when the genre changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle play/pause action
  const togglePlayPause = (fileUrl, index) => {
    if (audio && audio.src === fileUrl) {
      // If the track is already playing, toggle between play and pause
      if (isPlaying) {
        audio.pause(); // Pause the music if it's playing
        setIsPlaying(false);
      } else {
        audio.play(); // Resume playing the music from where it stopped
        setIsPlaying(true);
      }
    } else {
      // If a new track is selected, stop the current one and create a new audio element
      if (audio) {
        audio.pause(); // Pause the current track if it's playing
      }
      const newAudio = new Audio(fileUrl); // Create a new Audio element for the new track
      newAudio.play(); // Start playing the new track
      setAudio(newAudio); // Set the new audio element
      setCurrentTrackIndex(index); // Set the current track index
      setIsPlaying(true); // Set isPlaying to true
    }
  };

  // Function to go to the next track
  const playNextTrack = () => {
    if (currentTrackIndex < musicList.length - 1) {
      const nextTrackIndex = currentTrackIndex + 1;
      const nextTrack = musicList[nextTrackIndex];
      togglePlayPause(`http://localhost:5000${nextTrack.fileUrl}`, nextTrackIndex);
    }
  };

  // Function to go to the previous track
  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      const prevTrackIndex = currentTrackIndex - 1;
      const prevTrack = musicList[prevTrackIndex];
      togglePlayPause(`http://localhost:5000${prevTrack.fileUrl}`, prevTrackIndex);
    }
  };

  // Get the current music data for the player
  const currentMusic = musicList[currentTrackIndex];

  return (
    <div>
      <Navbar favoritesCount={favorites.length}/>
      <div className="music-list">
        
      <h2>{genre.charAt(0).toUpperCase() + genre.slice(1)} Music</h2>
      <div className="music-attr">
          <p>Title</p>
          <p>Artist</p>
          <p>Genre</p>
          <p>Play</p>
        </div>
        {musicList.length > 0 ? (
          musicList.map((music, index) => (
            <div key={music._id} className="music-item">
              <h3>{music.title}</h3>
              <p>{music.artist}</p>
              <p>{music.genre}</p>
              <button
                onClick={() => togglePlayPause(`http://localhost:5000${music.fileUrl}`, index)}
              >
                {isPlaying && currentTrackIndex === index ? <img src={pause}/> : <img src={play}/>}
              </button>
            </div>
          ))
        ) : (
              <div className="no-musics">
                  <img src={NoMusic} alt="" />
                  <p>No music found in this genre.</p>
              </div>
        )}
      </div>

      {/* <div className="navigation-buttons">
        <button onClick={playPreviousTrack} disabled={currentTrackIndex === 0}>
          Previous
        </button>
        <button onClick={playNextTrack} disabled={currentTrackIndex === musicList.length - 1}>
          Next
        </button>
      </div> */}

      {/* Player component with music data and controls */}
      {currentMusic && (
        <Player
        musicData={currentMusic}
        isPlaying={isPlaying}
        onNext={playNextTrack}
        onPrev={playPreviousTrack}
        togglePlayPause={togglePlayPause}
        />
      )}
    </div>
  );
};

export default MusicList;
