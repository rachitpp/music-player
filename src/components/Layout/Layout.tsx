import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
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

      // Create more subtle versions of the color for different parts
      const subtleBase = createSubtleColor(baseColor, 0.8);
      const subtleGradientStart = createSubtleColor(baseColor, 0.6);
      const subtleGradientEnd = createSubtleColor(baseColor, 0.2);
      const subtleSidebar = createSubtleColor(baseColor, 0.9);

      // Apply transitions with slight delays for a cascading effect
      setTimeout(() => {
        // Apply gradient to the document background (more muted)
        document.body.style.backgroundColor = subtleBase;

        // Set gradient start and end colors (more subtle)
        document.documentElement.style.setProperty(
          "--gradient-start",
          subtleGradientStart
        );
      }, 50);

      setTimeout(() => {
        document.documentElement.style.setProperty(
          "--gradient-end",
          subtleGradientEnd
        );

        // Apply color to primary elements
        document.documentElement.style.setProperty(
          "--primary-color",
          subtleBase
        );
      }, 150);

      setTimeout(() => {
        // Darken for sidebar
        document.documentElement.style.setProperty(
          "--sidebar-bg",
          subtleSidebar
        );
      }, 250);

      // Set additional animation properties
      document.documentElement.style.setProperty("--transition-speed", "1.2s");
    } else {
      // Reset to defaults with animation
      setTimeout(() => {
        document.body.style.backgroundColor = "#000000";
        document.documentElement.style.setProperty(
          "--gradient-start",
          "rgba(18, 18, 18, 0.8)"
        );
      }, 50);

      setTimeout(() => {
        document.documentElement.style.setProperty(
          "--gradient-end",
          "rgba(0, 0, 0, 0.9)"
        );
        document.documentElement.style.setProperty(
          "--primary-color",
          "#000000"
        );
      }, 150);

      setTimeout(() => {
        document.documentElement.style.setProperty(
          "--sidebar-bg",
          "rgba(0, 0, 0, 0.95)"
        );
      }, 250);
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

  return (
    <div className="app-layout">
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
    </div>
  );
};

export default Layout;
