import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaGlobeAmericas, 
  FaHome, 
  FaExchangeAlt, 
  FaInfoCircle, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter,
  FaBars,
  FaTimes,
  FaBolt
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Ticker Marquee */}
      <div className="moving-ticker-bar">
        <div className="ticker-badge">
          <FaBolt /> LIVE INSIGHTS
        </div>
        <div className="ticker-track">
          <div className="ticker-content">
            <span>🌍 Compare 250+ countries side-by-side — Population, GDP, Area, Timezones, Languages & News!</span>
            <span>⚡ Instant Side-by-Side Visual Metric Bars & Winner Indicators</span>
            <span>📰 Real-Time Headlines & Geopolitical News Feed</span>
            <span>🚀 Developed with React 19 & REST Countries API</span>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button 
        className="mobile-nav-toggle" 
        onClick={toggleMobileMenu} 
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <FaGlobeAmericas />
          </div>
          <div className="logo-text">
            <h2>Country<span>Explorer</span></h2>
            <span className="version-tag">v2.0 Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
            end
          >
            <FaHome className="nav-icon" />
            <span>Home</span>
          </NavLink>

          <NavLink 
            to="/compare" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaExchangeAlt className="nav-icon" />
            <span>Compare</span>
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaInfoCircle className="nav-icon" />
            <span>About</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="creator-badge">
            <p>Crafted by <strong>Kartik</strong></p>
          </div>

          <div className="social-icons">
            <a 
              href="https://www.linkedin.com/in/kartik-43a705258/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://github.com/KARTIK785643" 
              target="_blank" 
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://x.com/Kartik2431" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Twitter / X"
            >
              <FaTwitter />
            </a>
          </div>

          <div className="copyright">
            © {new Date().getFullYear()} CountryExplorer
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
