import React from 'react';
import { 
  FaGlobe, 
  FaExchangeAlt, 
  FaNewspaper, 
  FaCode, 
  FaUserGraduate, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter,
  FaCheckCircle,
  FaStar,
  FaServer,
  FaLayerGroup
} from 'react-icons/fa';
import './About.css';

function About() {
  return (
    <div className="about-dashboard animate-fade-in">
      {/* Header */}
      <div className="about-header text-center">
        <div className="badge"><FaStar /> Empowering Global Awareness</div>
        <h1>About <span className="gradient-text">Country Explorer</span></h1>
        <p>Your premier interactive portal for demographic analysis, geopolitical comparison, and live news coverage.</p>
      </div>

      {/* Main Glass Card */}
      <div className="about-hero-card glass-card">
        <h2>Mission & Vision</h2>
        <p>
          Country Explorer was crafted to make global demographic data intuitive, actionable, and visual. 
          By unifying reliable API sources into a side-by-side comparative engine, users can effortlessly analyze population ratios, 
          geographic land expanses, currency dynamics, and national news.
        </p>
      </div>

      {/* Features Grid */}
      <div className="about-section">
        <h2>Key Platform Highlights</h2>
        <div className="highlights-grid">
          <div className="highlight-card glass-card">
            <div className="highlight-icon"><FaExchangeAlt /></div>
            <h3>Comparative Dashboard</h3>
            <p>Evaluate population and area with animated visual metric bars and winner indicators.</p>
          </div>

          <div className="highlight-card glass-card">
            <div className="highlight-icon"><FaNewspaper /></div>
            <h3>Live Global News</h3>
            <p>Stay informed with real-time news headlines fetched directly for compared countries.</p>
          </div>

          <div className="highlight-card glass-card">
            <div className="highlight-icon"><FaGlobe /></div>
            <h3>250+ Nations Cataloged</h3>
            <p>Flags, official native titles, capitals, regions, subregions, currencies, and coat of arms.</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Showcase */}
      <div className="about-section">
        <h2>Built With Modern Tech Stack</h2>
        <div className="tech-stack-grid">
          <div className="tech-chip glass-card">
            <FaCode className="tech-icon" />
            <div className="tech-info">
              <strong>React 19 & Vite</strong>
              <span>Frontend UI Architecture</span>
            </div>
          </div>

          <div className="tech-chip glass-card">
            <FaServer className="tech-icon" />
            <div className="tech-info">
              <strong>REST Countries API</strong>
              <span>Geopolitical Data Provider</span>
            </div>
          </div>

          <div className="tech-chip glass-card">
            <FaNewspaper className="tech-icon" />
            <div className="tech-info">
              <strong>NewsData API</strong>
              <span>Live International Headlines</span>
            </div>
          </div>

          <div className="tech-chip glass-card">
            <FaLayerGroup className="tech-icon" />
            <div className="tech-info">
              <strong>Vanilla CSS3</strong>
              <span>Dark Glassmorphism System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Spotlight Card */}
      <div className="developer-spotlight-card glass-card">
        <div className="developer-avatar">
          <FaUserGraduate />
        </div>
        <div className="developer-details">
          <div className="dev-tag">DEVELOPER SPOTLIGHT</div>
          <h2>Developed by Kartik</h2>
          <p>Full-Stack Web Developer & UI Enthusiast passionate about building high-performance, user-centric web applications.</p>
          
          <div className="developer-socials">
            <a 
              href="https://www.linkedin.com/in/kartik-43a705258/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-social-link"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a 
              href="https://github.com/KARTIK785643" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-social-link"
            >
              <FaGithub /> GitHub
            </a>
            <a 
              href="https://x.com/Kartik2431" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-social-link"
            >
              <FaTwitter /> Twitter
            </a>
            
          </div>
          <h3>For any query contact : Kartik4023@gmail.com</h3>
        </div>
      </div>
    </div>
  );
}

export default About;
