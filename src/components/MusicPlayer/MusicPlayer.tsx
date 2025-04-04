import React, { useState, useEffect, useRef } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import "./MusicPlayer.scss";

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleFavorite,
    isFavorite,
  } = useMusicPlayer();
  const [progress, setProgress] = useState<number>(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = document.createElement("audio");
    setAudioElement(audio);

    // Update progress
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // Add event listeners
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
      setProgress(0);
      // Handle track ended logic if needed
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => {});
    };
  }, []);

  // Handle clicks outside the options menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update audio source when the track changes
  useEffect(() => {
    if (!audioElement || !currentTrack) return;

    audioElement.src = currentTrack.musicUrl;

    // Apply muted state when track changes
    audioElement.muted = isMuted;

    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.error("Playback error:", error);
      });
    }
  }, [currentTrack, audioElement, isPlaying, isMuted]);

  // Handle play/pause
  useEffect(() => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.error("Playback error:", error);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement]);

  // Update mute state when it changes
  useEffect(() => {
    if (!audioElement) return;
    audioElement.muted = isMuted;
  }, [isMuted, audioElement]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !currentTrack) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newPercentage = (clickPosition / progressBar.offsetWidth) * 100;

    setProgress(newPercentage);
    audioElement.currentTime = (newPercentage / 100) * audioElement.duration;
  };

  const handleToggleFavorite = () => {
    if (currentTrack) {
      toggleFavorite(currentTrack.id);
      setShowOptionsMenu(false);
    }
  };

  const toggleOptionsMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!currentTrack) {
    return <div className="right-player-empty">Select a track to play</div>;
  }

  return (
    <div className="right-player-container">
      {/* Current track info above the album art */}
      <div className="current-track-container">
        <div className="current-track-content">
          <div className="current-track-left">
            <div className="current-track-title">{currentTrack.title}</div>
            <div className="current-track-artist">
              {currentTrack.artistName}
            </div>
          </div>
        </div>
      </div>

      {/* Album art */}
      <div
        className="album-artwork"
        style={{ backgroundImage: `url(${encodeURI(currentTrack.thumbnail)})` }}
      >
        <div className="overlay"></div>
      </div>

      {/* Player controls at the bottom */}
      <div className="player-controls-section">
        {/* Progress bar */}
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Control buttons */}
        <div className="control-buttons">
          {/* Options button with dropdown menu */}
          <div className="options-menu-container" ref={optionsRef}>
            <button
              className="control-button options-button"
              onClick={toggleOptionsMenu}
            >
              <svg height="24" width="24" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" fill="currentColor"></circle>
                <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
                <circle cx="19" cy="12" r="2" fill="currentColor"></circle>
              </svg>
            </button>

            {showOptionsMenu && (
              <div className="options-dropdown">
                <button className="option-item" onClick={handleToggleFavorite}>
                  {isFavorite(currentTrack.id) ? (
                    <>
                      <svg height="16" width="16" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
                        />
                      </svg>
                      Remove from Favorites
                    </>
                  ) : (
                    <>
                      <svg height="16" width="16" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                      </svg>
                      Add to Favorites
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="main-controls">
            <button className="control-button skip-prev-button">
              <svg height="32" width="32" viewBox="0 0 32 32">
                <path d="M11.5 16.5L22 8v16l-10.5-7.5zm-7 0L15 8v16L4.5 16.5z"></path>
              </svg>
            </button>

            <button
              className="control-button play-button"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg height="32" width="32" viewBox="0 0 32 32">
                  <path d="M9 8h4v16H9V8zm10 0h4v16h-4V8z"></path>
                </svg>
              ) : (
                <svg height="32" width="32" viewBox="0 0 32 32">
                  <path d="M11 8l14 8-14 8V8z"></path>
                </svg>
              )}
            </button>

            <button className="control-button skip-next-button">
              <svg height="32" width="32" viewBox="0 0 32 32">
                <path d="M20.5 16.5L10 24V8l10.5 8.5zm7 0L17 24V8l10.5 8.5z"></path>
              </svg>
            </button>
          </div>

          {/* Volume control */}
          <button
            className={`control-button volume-button ${isMuted ? "muted" : ""}`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <svg height="24" width="24" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51c.66-1.24 1.03-2.65 1.03-4.15 0-4.28-2.99-7.86-7-8.76v2.05c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
              </svg>
            ) : (
              <svg height="24" width="24" viewBox="0 0 24 24">
                <path d="M14.5 8.7c0-1.3-0.8-2.4-2-2.8v5.6c1.2-0.4 2-1.5 2-2.8z"></path>
                <path d="M3 9v6h4l5 5V4L7 9H3z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
