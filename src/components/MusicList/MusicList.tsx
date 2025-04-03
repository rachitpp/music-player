import React, { useState } from 'react';
import { Track } from '../../types';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { Dropdown } from 'react-bootstrap';
import './MusicList.scss';

interface MusicListProps {
  title: string;
  tracks: Track[];
  loading?: boolean;
}

const MusicList: React.FC<MusicListProps> = ({ title, tracks, loading = false }) => {
  const { 
    currentTrack, 
    isPlaying, 
    setCurrentTrack, 
    togglePlayPause, 
    toggleFavorite, 
    isFavorite 
  } = useMusicPlayer();
  
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handleTrackClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    toggleFavorite(trackId);
  };

  if (loading) {
    return (
      <div className="music-list-container">
        <h2>{title}</h2>
        <div className="loading-tracks">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="loading-animation"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="music-list-container">
        <h2>{title}</h2>
        <div className="empty-list">
          <p>No tracks available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-list-container fade-in">
      <h2>{title}</h2>
      <div className="music-list">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isHovered = hoveredTrack === track.id;
          
          return (
            <div
              key={track.id}
              className={`track-item ${isCurrentTrack ? 'playing' : ''}`}
              onClick={() => handleTrackClick(track)}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="track-number">
                {isHovered ? (
                  <span className="play-icon">
                    {isCurrentTrack && isPlaying ? '⏸️' : '▶️'}
                  </span>
                ) : (
                  index + 1
                )}
              </div>
              <div 
                className="track-thumbnail" 
                style={{ backgroundImage: `url(${track.thumbnail})` }}
              ></div>
              <div className="track-info">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artistName}</div>
              </div>
              <div className="track-duration">{track.duration}</div>
              <Dropdown className="track-options">
                <Dropdown.Toggle variant="transparent" id={`dropdown-${track.id}`}>
                  •••
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-dark">
                  <Dropdown.Item onClick={(e) => handleFavoriteToggle(e, track.id)}>
                    {isFavorite(track.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicList;
