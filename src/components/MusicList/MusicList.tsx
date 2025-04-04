import React, { useState } from "react";
import { Track } from "../../types";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import "./MusicList.scss";

interface MusicListProps {
  title: string;
  tracks: Track[];
  loading?: boolean;
}

const MusicList: React.FC<MusicListProps> = ({
  title,
  tracks,
  loading = false,
}) => {
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } =
    useMusicPlayer();

  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
    }
  };

  if (loading) {
    return (
      <div className="music-list-container">
        {title && <h2>{title}</h2>}
        <div className="loading-tracks">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="loading-animation"></div>
            ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="music-list-container">
        {title && <h2>{title}</h2>}
        <div className="empty-list">
          <p>No tracks available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-list-container fade-in">
      {title && <h2>{title}</h2>}
      <div className="music-list">
        {tracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isHovered = hoveredTrack === track.id;

          return (
            <div
              key={track.id}
              className={`track-item ${isCurrentTrack ? "playing" : ""}`}
              onClick={() => handleTrackClick(track)}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="track-content">
                <div className="track-left">
                  <div
                    className="track-thumbnail"
                    style={{
                      backgroundImage: `url(${encodeURI(track.thumbnail)})`,
                    }}
                  >
                    {isHovered && (
                      <div className="thumbnail-overlay">
                        <span className="play-icon">
                          {isCurrentTrack && isPlaying ? "⏸️" : "▶️"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">{track.artistName}</div>
                  </div>
                </div>

                <div className="track-right">
                  <div className="track-duration">{track.duration}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicList;
