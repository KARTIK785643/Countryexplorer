import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <h2>Countryexplorer</h2>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/compare">Compare</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      {/* Social Icons */}
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/kartik-43a705258/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://github.com/KARTIK785643" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="https://x.com/Kartik2431" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      </div>

      <div className="footer">@2025</div>
    </div>
  );
}

export default Sidebar;
