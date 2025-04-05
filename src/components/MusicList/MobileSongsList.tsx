import React from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import MusicList from "./MusicList";
import "./MobileSongsList.scss";

interface MobileSongsListProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileSongsList: React.FC<MobileSongsListProps> = ({
  isVisible,
  onClose,
}) => {
  const { filteredTracks, activeTab, setActiveTab, currentTrack } =
    useMusicPlayer();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isVisible) return null;

  return (
    <div className="mobile-songs-list-overlay">
      <div className="mobile-songs-list-header">
        <h1>{activeTab}</h1>
        <div className="header-actions">
          {currentTrack && (
            <div className="now-playing-badge">
              <div className="now-playing-dot"></div>
              <span>Now Playing</span>
            </div>
          )}
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="mobile-songs-tabs">
        <button
          className={activeTab === "For You" ? "active" : ""}
          onClick={() => handleTabChange("For You")}
        >
          <svg height="16" width="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            ></path>
          </svg>
          For You
        </button>
        <button
          className={activeTab === "Top Tracks" ? "active" : ""}
          onClick={() => handleTabChange("Top Tracks")}
        >
          <svg height="16" width="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
            ></path>
          </svg>
          Top Tracks
        </button>
        <button
          className={activeTab === "Favourites" ? "active" : ""}
          onClick={() => handleTabChange("Favourites")}
        >
          <svg height="16" width="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            ></path>
          </svg>
          Favourites
        </button>
        <button
          className={activeTab === "Recently Played" ? "active" : ""}
          onClick={() => handleTabChange("Recently Played")}
        >
          <svg height="16" width="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
            ></path>
          </svg>
          Recently Played
        </button>
      </div>

      <div className="mobile-songs-list-content">
        <MusicList title="" tracks={filteredTracks} loading={false} />
      </div>
    </div>
  );
};

export default MobileSongsList;
