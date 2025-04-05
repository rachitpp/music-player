export interface Track {
  id: string;
  title: string;
  thumbnail: string;
  musicUrl: string;
  duration: string;
  artistName: string;
  colorScheme?: string;
}

export interface MusicContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  recentlyPlayed: Track[];
  favorites: string[];
  setCurrentTrack: (track: Track) => void;
  togglePlayPause: () => void;
  addToRecentlyPlayed: (track: Track) => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  setSearchQuery: (query: string) => void;
  filteredTracks: Track[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
}
