import React, { useState, useRef, useEffect } from 'react';
import '../components/player.css'; // Import the CSS file
import play from '../assets/play.png'
import prev from '../assets/prev.png'
import pause from '../assets/pause.png'
import next from '../assets/next.png'

const Player = ({ musicData, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Whenever the musicData changes, reset the audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [musicData]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    onNext();  // Go to the next song when current song ends
  };

  const handlePrev = () => {
    onPrev();  // Go to the previous song
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="player-container">
      {/* Music Info */}
      <div className="music-info">
        <p className='music-title'>{musicData.title} - {musicData.artist}</p>
        <audio
          ref={audioRef}
          src={`http://localhost:5000${musicData.fileUrl}`}  // Use full URL for the file
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <img src={prev} alt="prev-btn" onClick={handlePrev} />
        {/* <button onClick={handlePrev} className="prev-button">
          img
        </button> */}
        {/* <button onClick={handlePlayPause} className="play-button">
          {isPlaying ? 'Pause' : 'Play'}
        </button> */}
        {isPlaying ? <img src={pause} onClick={handlePlayPause}/> : <img src={play} onClick={handlePlayPause}/>}
        {/* <button onClick={onNext} className="next-button">
          Next
        </button> */}
        <img src={next} alt="next-btn" onClick={onNext} />
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
