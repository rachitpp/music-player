import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import MusicList from '../MusicList/MusicList';
import SearchBar from '../MusicList/SearchBar';
import { Track } from '../../types';
import './ContentArea.scss';

const ContentArea: React.FC = () => {
  const { 
    activeTab, 
    filteredTracks, 
    recentlyPlayed, 
    favorites
  } = useMusicPlayer();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Update favorite tracks when favorites changes
  useEffect(() => {
    const favs = favorites.map(id => {
      // Find track in the global list of tracks from the music player context
      return filteredTracks.find(track => track.id === id);
    }).filter(Boolean) as Track[];
    setFavoriteTracks(favs);
  }, [favorites, filteredTracks]);

  // We no longer need the featured track functionality as per the design

  const renderContent = () => {
    switch (activeTab) {
      case 'For You':
        return (
          <>
            <SearchBar />
            <MusicList 
              title="For You" 
              tracks={filteredTracks}
              loading={loading}
            />
          </>
        );
      case 'Top Tracks':
        return (
          <>
            <SearchBar />
            <MusicList 
              title="Top Tracks" 
              tracks={filteredTracks}
              loading={loading}
            />
          </>
        );
      case 'Favourites':
        return (
          <>
            <h1 className="page-title">Favourites</h1>
            <MusicList 
              title="Tracks you love" 
              tracks={favoriteTracks}
              loading={loading}
            />
          </>
        );
      case 'Recently Played':
        return (
          <>
            <h1 className="page-title">Recently Played</h1>
            <MusicList 
              title="Your listening history" 
              tracks={recentlyPlayed}
              loading={loading}
            />
          </>
        );
      default:
        return <div>Page not found</div>;
    }
  };
  
  return (
    <div className="content-area-container">
      {renderContent()}
    </div>
  );
};

export default ContentArea;
