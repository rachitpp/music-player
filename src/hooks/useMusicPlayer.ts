import { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';
import { MusicContextType } from '../types';

export const useMusicPlayer = (): MusicContextType => {
  const context = useContext(MusicContext);
  
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  
  return context;
};
