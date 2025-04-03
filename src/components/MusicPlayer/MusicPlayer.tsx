import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import './MusicPlayer.scss';

const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause } = useMusicPlayer();
  const [progress, setProgress] = useState<number>(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.createElement('audio');
    setAudioElement(audio);
    
    // Update progress
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      setProgress(0);
      // Handle track ended logic if needed
    });
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => {});
    };
  }, []);

  // Update audio source when the track changes
  useEffect(() => {
    if (!audioElement || !currentTrack) return;
    
    audioElement.src = currentTrack.musicUrl;
    
    if (isPlaying) {
      audioElement.play().catch(error => {
        console.error('Playback error:', error);
      });
    }
  }, [currentTrack, audioElement, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.play().catch(error => {
        console.error('Playback error:', error);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !currentTrack) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newPercentage = (clickPosition / progressBar.offsetWidth) * 100;
    
    setProgress(newPercentage);
    audioElement.currentTime = (newPercentage / 100) * audioElement.duration;
  };

  if (!currentTrack) {
    return <div className="right-player-empty"></div>;
  }

  return (
    <div className="right-player-container">
      {/* Album art at the top */}
      <div 
        className="album-artwork" 
        style={{ backgroundImage: `url(${currentTrack.thumbnail})` }}
      >
        <div className="overlay"></div>
        
        {/* Track title overlay */}
        <div className="track-info-overlay">
          <div className="current-title">{currentTrack.title}</div>
          <div className="current-artist">{currentTrack.artistName}</div>
        </div>
      </div>
      
      {/* Player controls below */}
      <div className="player-controls-section">
        {/* Progress bar */}
        <div 
          className="progress-container" 
          onClick={handleProgressClick}
        >
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        {/* Control buttons */}
        <div className="control-buttons">
          {/* More options button */}
          <button className="control-button options-button">
            <svg height="16" width="16" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
            </svg>
          </button>
          
          {/* Main controls */}
          <button className="control-button skip-prev-button">
            <svg height="24" width="24" viewBox="0 0 24 24">
              <path d="M7 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7zM17 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2z"></path>
            </svg>
          </button>
          
          <button 
            className="control-button play-button"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg height="32" width="32" viewBox="0 0 24 24">
                <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            ) : (
              <svg height="32" width="32" viewBox="0 0 24 24">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>
            )}
          </button>
          
          <button className="control-button skip-next-button">
            <svg height="24" width="24" viewBox="0 0 24 24">
              <path d="M16 6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2zM6 6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2z"></path>
            </svg>
          </button>
          
          {/* Volume control */}
          <button className="control-button volume-button">
            <svg height="16" width="16" viewBox="0 0 16 16">
              <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
