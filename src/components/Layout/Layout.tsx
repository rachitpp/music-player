import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import { Container } from 'react-bootstrap';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { currentTrack } = useMusicPlayer();

  // Set background gradient based on current track
  useEffect(() => {
    if (currentTrack?.colorScheme) {
      document.documentElement.style.setProperty(
        '--gradient-start', 
        `${currentTrack.colorScheme}cc` // Add transparency
      );
      document.documentElement.style.setProperty(
        '--gradient-end', 
        `${currentTrack.colorScheme}22` // More transparency
      );
    } else {
      document.documentElement.style.setProperty(
        '--gradient-start', 
        'rgba(18, 18, 18, 0.8)'
      );
      document.documentElement.style.setProperty(
        '--gradient-end', 
        'rgba(0, 0, 0, 0.9)'
      );
    }
  }, [currentTrack]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Left Panel - Sidebar */}
        <div className="sidebar-container">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        
        {/* Content Container (middle + right) */}
        <div className="content-container">
          {/* Middle Panel - Content Area */}
          <div className="content-area">
            {windowWidth <= 768 && (
              <div className="menu-toggle" onClick={toggleSidebar}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                </svg>
              </div>
            )}
            
            <Container fluid>
              {children}
            </Container>
          </div>
          
          {/* Right Panel - Music Player */}
          <div className="right-panel">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
