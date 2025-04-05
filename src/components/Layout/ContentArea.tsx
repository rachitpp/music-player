import React, { useState, useEffect } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import MusicList from "../MusicList/MusicList";
import SearchBar from "../MusicList/SearchBar";
import { Track } from "../../types";
import "./ContentArea.scss";

const ContentArea: React.FC = () => {
  const { activeTab, filteredTracks, recentlyPlayed, favorites } =
    useMusicPlayer();

  const [loading, setLoading] = useState<boolean>(true);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [animateContent, setAnimateContent] = useState<boolean>(false);
  const [previousTab, setPreviousTab] = useState<string>(activeTab);

  // Simulate loading
  useEffect(() => {
    if (previousTab !== activeTab) {
      // Trigger animation when tab changes
      setAnimateContent(true);
      setLoading(true);

      // Set a short delay before displaying new content for smooth transition
      const timer = setTimeout(() => {
        setPreviousTab(activeTab);
        setAnimateContent(false);

        // Add a slight delay for loading animation to simulate content loading
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // Initial load
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [activeTab, previousTab]);

  // Update favorite tracks when favorites changes
  useEffect(() => {
    const favs = favorites
      .map((id) => {
        // Find track in the global list of tracks from the music player context
        return filteredTracks.find((track) => track.id === id);
      })
      .filter(Boolean) as Track[];
    setFavoriteTracks(favs);
  }, [favorites, filteredTracks]);

  // We no longer need the featured track functionality as per the design

  const renderContent = () => {
    switch (activeTab) {
      case "For You":
        return (
          <>
            <div className="fixed-content">
              <h1 className="page-title">For You</h1>
              <SearchBar />
            </div>
            <div className="scrollable-content">
              <MusicList title="" tracks={filteredTracks} loading={loading} />
            </div>
          </>
        );
      case "Top Tracks":
        return (
          <>
            <div className="fixed-content">
              <h1 className="page-title">Top Tracks</h1>
              <SearchBar />
            </div>
            <div className="scrollable-content">
              <MusicList title="" tracks={filteredTracks} loading={loading} />
            </div>
          </>
        );
      case "Favourites":
        return (
          <>
            <div className="fixed-content">
              <h1 className="page-title">Favourites</h1>
            </div>
            <div className="scrollable-content">
              <MusicList
                title="Tracks you love"
                tracks={favoriteTracks}
                loading={loading}
              />
            </div>
          </>
        );
      case "Recently Played":
        return (
          <>
            <div className="fixed-content">
              <h1 className="page-title">Recently Played</h1>
            </div>
            <div className="scrollable-content">
              <MusicList
                title="Your listening history"
                tracks={recentlyPlayed}
                loading={loading}
              />
            </div>
          </>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div
      className={`content-area-container ${
        animateContent ? "fade-out" : "fade-in"
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default ContentArea;
