import React, { useState, useEffect } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import "./SearchBar.scss";

const SearchBar: React.FC = () => {
  const { setSearchQuery } = useMusicPlayer();
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Debounce search to avoid too many updates
    const timer = setTimeout(() => {
      setSearchQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, setSearchQuery]);

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <svg className="search-icon" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
