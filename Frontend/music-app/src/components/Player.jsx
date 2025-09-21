import React, { useState, useRef, useEffect } from 'react';
import '../components/player.css'; // Import the CSS file
import play from '../assets/play.png';
import prev from '../assets/prev.png';
import pause from '../assets/pause.png';
import next from '../assets/next.png';
import '@fortawesome/fontawesome-free/css/all.min.css';



const Player = ({ musicData, isPlaying, onNext, onPrev, togglePlayPause, favorites=[], toggleFavorite }) => {
  const isFavorited = Array.isArray(favorites) && musicData
  ? favorites.some(fav => fav.fileUrl === musicData.fileUrl)
  : false;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Whenever the musicData changes, reset the audio element
    if (audioRef.current) {
      audioRef.current.pause(); // Pause current audio
      audioRef.current.load();  // Reload new audio
      setCurrentTime(0); // Reset current time
      setDuration(0); // Reset duration
    }
  }, [musicData]); // Listen to musicData changes

  // This function updates current time and duration
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // When a song ends, go to the next song
  const handleEnded = () => {
    onNext();
  };

  // Handle the previous song button click
  const handlePrev = () => {
    onPrev();
  };

  // Format the time to MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Handle the progress bar slider change
  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="player-container">
      {/* Music Info */}
      <div className="music-info">
        <p className="music-title">{musicData.title} - {musicData.artist}</p>
        <audio
          ref={audioRef}
          src={`http://localhost:5000${musicData.fileUrl}`} // Use full URL for the file
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          autoPlay={isPlaying} // Auto-play based on the isPlaying prop
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <img src={prev} alt="prev-btn" onClick={handlePrev} />
        <button onClick={() => togglePlayPause(musicData.fileUrl, 0)}>
          {isPlaying ? <img src={pause} alt="Pause" /> : <img src={play} alt="Play" />}
        </button>
        <img src={next} alt="next-btn" onClick={onNext} />
        {/* Heart/Favorite Button */}
        <i
    className={isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}
    onClick={() => toggleFavorite(musicData)}
    style={{ fontSize: '20px', color: isFavorited ? 'red' : 'gray', marginLeft: '10px', cursor: 'pointer' }}
  ></i>
      </div>

      {/* Progress */}
      <div className="progress">
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        <input
          type="range"
          className="progress-bar"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
        />
      </div>
    </div>
  );
};

export default Player;
