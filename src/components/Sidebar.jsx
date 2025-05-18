import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      
      <ul>
        <h2>Darshak</h2>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/compare">Compare</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <div className="footer">@2025</div>
    </div>
  );
}

export default Sidebar;
