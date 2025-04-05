import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import { Track, MusicContextType } from "../types";
import { tracks } from "../data/tracks";

export const MusicContext = createContext<MusicContextType | undefined>(
  undefined
);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(tracks);
  const [activeTab, setActiveTab] = useState<string>("For You");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Load favorites from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Load recently played from session storage
  useEffect(() => {
    const storedRecentlyPlayed = sessionStorage.getItem("recentlyPlayed");
    if (storedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(storedRecentlyPlayed));
    }
  }, []);

  // Save favorites to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save recently played to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.musicUrl;

      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback error:", e));
      }

      addToRecentlyPlayed(currentTrack);
    }
  }, [currentTrack]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTracks(tracks);
    } else {
      const filtered = tracks.filter((track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [searchQuery]);

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    } else if (tracks.length > 0) {
      // If no track is selected, select the first one and start playing
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const addToRecentlyPlayed = (track: Track) => {
    setRecentlyPlayed((prev) => {
      // Remove the track if it's already in the list
      const filtered = prev.filter((item) => item.id !== track.id);
      // Add the track to the beginning
      const updated = [track, ...filtered];
      // Keep only the last 10 tracks
      return updated.slice(0, 10);
    });
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const isFavorite = (trackId: string) => {
    return favorites.includes(trackId);
  };

  const playNextTrack = () => {
    if (!currentTrack) {
      // If no track is playing, start with the first track
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      }
      return;
    }

    // Find the index of the current track
    const currentIndex = tracks.findIndex(
      (track) => track.id === currentTrack.id
    );
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      // If there's a next track, play it
      setCurrentTrack(tracks[currentIndex + 1]);
      setIsPlaying(true);
    } else if (currentIndex !== -1) {
      // If we're at the last track, loop back to the first track
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const playPreviousTrack = () => {
    if (!currentTrack) {
      // If no track is playing, start with the first track
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      }
      return;
    }

    // Find the index of the current track
    const currentIndex = tracks.findIndex(
      (track) => track.id === currentTrack.id
    );
    if (currentIndex > 0) {
      // If there's a previous track, play it
      setCurrentTrack(tracks[currentIndex - 1]);
      setIsPlaying(true);
    } else if (currentIndex === 0) {
      // If we're at the first track, loop back to the last track
      setCurrentTrack(tracks[tracks.length - 1]);
      setIsPlaying(true);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        recentlyPlayed,
        favorites,
        setCurrentTrack,
        togglePlayPause,
        addToRecentlyPlayed,
        toggleFavorite,
        isFavorite,
        setSearchQuery,
        filteredTracks,
        activeTab,
        setActiveTab,
        playNextTrack,
        playPreviousTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
