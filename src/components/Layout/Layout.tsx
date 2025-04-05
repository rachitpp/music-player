import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import MobilePlayer from "../MusicPlayer/MobilePlayer";
import { Container } from "react-bootstrap";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import "./Layout.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { currentTrack } = useMusicPlayer();

  // Helper function to create a more subtle version of a color
  const createSubtleColor = (hexColor: string, opacity: number = 0.5) => {
    // Convert hex to RGB
    let r = parseInt(hexColor.substring(1, 3), 16);
    let g = parseInt(hexColor.substring(3, 5), 16);
    let b = parseInt(hexColor.substring(5, 7), 16);

    // Mix with black to make it more muted
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);

    // Return with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Set background gradient based on current track
  useEffect(() => {
    if (currentTrack?.colorScheme) {
      const baseColor = currentTrack.colorScheme;

      // Create more subtle versions of the color for all sections
      const subtleColor = createSubtleColor(baseColor, 0.95);

      // Apply the same color to all panels for consistency
      document.body.style.backgroundColor = subtleColor;
      document.documentElement.style.setProperty("--sidebar-bg", subtleColor);
      document.documentElement.style.setProperty(
        "--primary-color",
        subtleColor
      );
      document.documentElement.style.setProperty(
        "--background-color",
        subtleColor
      );

      // Set additional animation properties
      document.documentElement.style.setProperty("--transition-speed", "1.2s");
    } else {
      // Reset to defaults with animation
      const defaultColor = "rgba(18, 18, 18, 0.95)";
      document.body.style.backgroundColor = defaultColor;
      document.documentElement.style.setProperty("--sidebar-bg", defaultColor);
      document.documentElement.style.setProperty(
        "--primary-color",
        defaultColor
      );
      document.documentElement.style.setProperty(
        "--background-color",
        defaultColor
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

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (windowWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Overlay for mobile when sidebar is open */}
      {windowWidth <= 768 && sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={handleOverlayClick}
        ></div>
      )}

      <div className="main-content">
        {/* Left Panel - Sidebar */}
        <div className={`sidebar-container ${sidebarOpen ? "show" : ""}`}>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Content Container (middle + right) */}
        <div className="content-container">
          {/* Middle Panel - Content Area */}
          <div className="content-area">
            {windowWidth <= 768 && (
              <div
                className="menu-toggle right-aligned"
                onClick={toggleSidebar}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                  ></path>
                </svg>
              </div>
            )}

            <Container fluid>{children}</Container>
          </div>

          {/* Right Panel - Music Player */}
          <div className="right-panel">
            <MusicPlayer />
          </div>
        </div>
      </div>

      {/* Mobile Player (only shown on small screens) */}
      {currentTrack && <MobilePlayer />}
    </div>
  );
};

export default Layout;
