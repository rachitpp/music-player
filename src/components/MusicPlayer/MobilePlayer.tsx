import React, { useState, useEffect } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import "./MobilePlayer.scss";

interface MobilePlayerProps {
  toggleSongsList: () => void;
}

const MobilePlayer: React.FC<MobilePlayerProps> = ({ toggleSongsList }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleFavorite,
    isFavorite,
    playNextTrack,
    playPreviousTrack,
  } = useMusicPlayer();
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("0:00");
  const [durationText, setDurationText] = useState<string>("0:00");
  const [fullscreenPlayer, setFullscreenPlayer] = useState<boolean>(false);

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setProgressText(formatTime(audio.currentTime));
        setDurationText(formatTime(audio.duration));
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentTrack) {
    return null;
  }

  const isCurrentTrackFavorite = isFavorite(currentTrack.id);

  const fullscreenPlayerStyle = {
    background: `linear-gradient(180deg, #871d1d 0%, #5e1616 60%, #350d0d 100%)`,
  };

  const handlePreviousTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playPreviousTrack();
  };

  const handleNextTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playNextTrack();
  };

  if (fullscreenPlayer) {
    return (
      <div className="fullscreen-player" style={fullscreenPlayerStyle}>
        <button
          className="back-button"
          aria-label="Go back"
          onClick={() => setFullscreenPlayer(false)}
        >
          <svg height="32" width="32" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            ></path>
          </svg>
        </button>

        <div className="main-content">
          <div className="album-art-container">
            <div
              className="album-art"
              style={{
                backgroundImage: `url(${encodeURI(currentTrack.thumbnail)})`,
              }}
            ></div>
          </div>

          <div className="fullscreen-track-info">
            <h1 className="track-title">{currentTrack.title}</h1>
            <h2 className="track-artist">{currentTrack.artistName}</h2>
            <button
              className={`like-button ${
                isCurrentTrackFavorite ? "active" : ""
              }`}
              onClick={() => toggleFavorite(currentTrack.id)}
              aria-label={
                isCurrentTrackFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              {isCurrentTrackFavorite ? (
                <svg height="24" width="24" viewBox="0 0 24 24">
                  <path
                    fill="#1DB954"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  ></path>
                </svg>
              ) : (
                <svg height="24" width="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          <div className="fullscreen-progress-container">
            <div className="progress-time">
              <span className="current-time">{progressText}</span>
              <span className="duration-time">{durationText}</span>
            </div>
            <div className="fullscreen-progress-bar">
              <div
                className="fullscreen-progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="simplified-controls">
            <button
              className="control-button"
              aria-label="Previous track"
              onClick={handlePreviousTrack}
            >
              <svg height="28" width="28" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"
                ></path>
              </svg>
            </button>
            <button
              className="play-button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg height="36" width="36" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                  ></path>
                </svg>
              ) : (
                <svg height="36" width="36" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>
            <button
              className="control-button"
              aria-label="Next track"
              onClick={handleNextTrack}
            >
              <svg height="28" width="28" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"
                ></path>
              </svg>
            </button>
          </div>

          <div className="player-status">
            <span>PLAYING FROM ARTIST</span>
            <h2>{currentTrack.artistName}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-player-container">
      <div
        className="mobile-player-content"
        onClick={() => setFullscreenPlayer(true)}
      >
        <button
          className="mobile-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSongsList();
          }}
          aria-label="View song list"
        >
          <svg height="22" width="22" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            ></path>
          </svg>
        </button>
        <div
          className="mobile-player-thumbnail"
          style={{
            backgroundImage: `url(${encodeURI(currentTrack.thumbnail)})`,
          }}
        ></div>
        <div className="mobile-player-info">
          <div className="mobile-player-title">{currentTrack.title}</div>
          <div className="mobile-player-artist">{currentTrack.artistName}</div>
        </div>
        <div className="mobile-player-controls">
          <button
            className="mobile-player-like"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentTrack.id);
            }}
            aria-label={
              isCurrentTrackFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isCurrentTrackFavorite ? (
              <svg height="20" width="20" viewBox="0 0 24 24">
                <path
                  fill="#1DB954"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                ></path>
              </svg>
            ) : (
              <svg height="20" width="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                ></path>
              </svg>
            )}
          </button>
          <button
            className="mobile-player-control-prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousTrack();
            }}
            aria-label="Previous track"
          >
            <svg height="18" width="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"
              ></path>
            </svg>
          </button>
          <button
            className="mobile-player-control"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg height="22" width="22" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                ></path>
              </svg>
            ) : (
              <svg height="22" width="22" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5v14l11-7z"></path>
              </svg>
            )}
          </button>
          <button
            className="mobile-player-control-next"
            onClick={(e) => {
              e.stopPropagation();
              handleNextTrack();
            }}
            aria-label="Next track"
          >
            <svg height="18" width="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="mobile-progress-container">
        <div className="mobile-progress-bar">
          <div
            className="mobile-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayer;
