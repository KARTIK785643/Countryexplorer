import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaGlobe, 
  FaExchangeAlt, 
  FaSearch, 
  FaUsers, 
  FaLandmark, 
  FaChartBar, 
  FaNewspaper, 
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaLayerGroup
} from 'react-icons/fa';
import { fetchAllCountries } from '../services/countryApi';
import './Home.css';

const PRESET_PAIRS = [
  { name1: 'United States', flag1: '🇺🇸', name2: 'India', flag2: '🇮🇳', category: 'Economic Giants' },
  { name1: 'Japan', flag1: '🇯🇵', name2: 'Germany', flag2: '🇩🇪', category: 'Tech & Industry' },
  { name1: 'United Kingdom', flag1: '🇬🇧', name2: 'Canada', flag2: '🇨🇦', category: 'Commonwealth Leaders' },
  { name1: 'Australia', flag1: '🇦🇺', name2: 'Brazil', flag2: '🇧🇷', category: 'Southern Hemisphere' },
  { name1: 'France', flag1: '🇫🇷', name2: 'Italy', flag2: '🇮🇹', category: 'European Icons' },
  { name1: 'South Africa', flag1: '🇿🇦', name2: 'Egypt', flag2: '🇪🇬', category: 'African Capitals' },
];

const FEATURED_COUNTRIES_DEFAULT = [
  { name: 'India', capital: 'New Delhi', region: 'Asia', population: '1.4B', area: '3.28M km²', flag: 'https://flags.restcountries.com/v5/svg/in.svg' },
  { name: 'United States', capital: 'Washington, D.C.', region: 'Americas', population: '331M', area: '9.83M km²', flag: 'https://flags.restcountries.com/v5/svg/us.svg' },
  { name: 'Japan', capital: 'Tokyo', region: 'Asia', population: '125M', area: '377K km²', flag: 'https://flags.restcountries.com/v5/svg/jp.svg' },
  { name: 'Germany', capital: 'Berlin', region: 'Europe', population: '83M', area: '357K km²', flag: 'https://flags.restcountries.com/v5/svg/de.svg' },
  { name: 'Brazil', capital: 'Brasília', region: 'Americas', population: '214M', area: '8.51M km²', flag: 'https://flags.restcountries.com/v5/svg/br.svg' },
  { name: 'Australia', capital: 'Canberra', region: 'Oceania', population: '25.6M', area: '7.69M km²', flag: 'https://flags.restcountries.com/v5/svg/au.svg' },
  { name: 'United Kingdom', capital: 'London', region: 'Europe', population: '67M', area: '242K km²', flag: 'https://flags.restcountries.com/v5/svg/gb.svg' },
  { name: 'South Africa', capital: 'Pretoria', region: 'Africa', population: '59M', area: '1.22M km²', flag: 'https://flags.restcountries.com/v5/svg/za.svg' }
];

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [quickCountries, setQuickCountries] = useState(FEATURED_COUNTRIES_DEFAULT);

  // Fetch full live countries list from api.restcountries.com v5 API
  useEffect(() => {
    fetchAllCountries()
      .then(list => {
        if (list && list.length > 0) {
          const formatted = list.slice(0, 16).map(c => ({
            name: c.name,
            capital: c.capital,
            region: c.region,
            population: c.population >= 1e9 
              ? `${(c.population / 1e9).toFixed(1)}B` 
              : `${(c.population / 1e6).toFixed(1)}M`,
            area: `${(c.area / 1e3).toFixed(0)}K km²`,
            flag: c.flag
          }));
          setQuickCountries(formatted);
        }
      })
      .catch(err => console.warn('Home fetch error:', err));
  }, []);

  const handleLaunchCompare = (c1 = '', c2 = '') => {
    if (c1 && c2) {
      navigate(`/compare?c1=${encodeURIComponent(c1)}&c2=${encodeURIComponent(c2)}`);
    } else if (c1) {
      navigate(`/compare?c1=${encodeURIComponent(c1)}`);
    } else {
      navigate('/compare');
    }
  };

  const filteredCountries = quickCountries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.capital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || c.region.toLowerCase() === selectedContinent.toLowerCase();
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="home-dashboard animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section glass-card">
        <div className="hero-content">
          <div className="badge">
            <FaStar /> Official REST Countries v5 Powered
          </div>
          <h1>
            Discover & Compare <span className="gradient-text">Nations Worldwide</span>
          </h1>
          <p>
            Side-by-side comparative analysis of 254+ countries powered by api.restcountries.com. Inspect population metrics, economic indicators, geographic data, and real-time news headlines.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => handleLaunchCompare()}>
              <FaExchangeAlt /> Launch Comparison System
            </button>

            <a href="#featured" className="btn-secondary">
              <FaGlobe /> Explore Popular Countries
            </a>
          </div>
        </div>

        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FaGlobe /></div>
            <h3>254</h3>
            <p>Countries & Territories</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaShieldAlt /></div>
            <h3>195</h3>
            <p>UN Member States</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaChartBar /></div>
            <h3>20+</h3>
            <p>Comparative Indicators</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaNewspaper /></div>
            <h3>Real-Time</h3>
            <p>News Feed Integration</p>
          </div>
        </div>
      </section>

      {/* Quick Compare Presets Section */}
      <section className="section-block">
        <div className="section-header">
          <h2><FaExchangeAlt className="section-icon" /> Popular Comparison Presets</h2>
          <p>Click any pair below to launch immediate side-by-side analysis</p>
        </div>

        <div className="presets-grid">
          {PRESET_PAIRS.map((pair, index) => (
            <div 
              key={index} 
              className="preset-card glass-card"
              onClick={() => handleLaunchCompare(pair.name1, pair.name2)}
            >
              <div className="preset-category">{pair.category}</div>
              <div className="preset-versus">
                <div className="country-pill">
                  <span className="preset-flag">{pair.flag1}</span>
                  <span className="preset-name">{pair.name1}</span>
                </div>
                <div className="vs-badge">VS</div>
                <div className="country-pill">
                  <span className="preset-flag">{pair.flag2}</span>
                  <span className="preset-name">{pair.name2}</span>
                </div>
              </div>
              <div className="preset-footer">
                <span>Compare Specs</span>
                <FaArrowRight />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Countries Directory */}
      <section className="section-block" id="featured">
        <div className="section-header flex-header">
          <div>
            <h2><FaLayerGroup className="section-icon" /> Global Directory Spotlight</h2>
            <p>Quick lookup & stats powered by api.restcountries.com/countries/v5</p>
          </div>

          <div className="search-filter-wrapper">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search country or capital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="region-pills">
          {['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map(region => (
            <button
              key={region}
              className={`pill-btn ${selectedContinent === region ? 'active' : ''}`}
              onClick={() => setSelectedContinent(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Country Grid */}
        <div className="country-grid">
          {filteredCountries.map((c, i) => (
            <div key={i} className="featured-country-card glass-card">
              <div className="country-card-header">
                {c.flag && <img src={c.flag} alt={`${c.name} flag`} className="country-card-flag" />}
                <div className="country-card-title">
                  <h3>{c.name}</h3>
                  <span className="region-tag">{c.region}</span>
                </div>
              </div>

              <div className="country-card-metrics">
                <div className="metric-row">
                  <span><FaLandmark /> Capital:</span>
                  <strong>{c.capital}</strong>
                </div>
                <div className="metric-row">
                  <span><FaUsers /> Population:</span>
                  <strong>{c.population}</strong>
                </div>
                <div className="metric-row">
                  <span><FaGlobe /> Land Area:</span>
                  <strong>{c.area}</strong>
                </div>
              </div>

              <button 
                className="card-action-btn"
                onClick={() => handleLaunchCompare(c.name)}
              >
                <FaExchangeAlt /> Compare {c.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="section-block">
        <div className="features-grid">
          <div className="feature-box glass-card">
            <div className="feature-icon"><FaChartBar /></div>
            <h3>Visual Relative Metric Bars</h3>
            <p>Compare population & land area with animated side-by-side relative progress bars and winner indicators.</p>
          </div>
          <div className="feature-box glass-card">
            <div className="feature-icon"><FaNewspaper /></div>
            <h3>Live News Aggregator</h3>
            <p>Stay informed with current top news articles and international updates fetched directly for selected nations.</p>
          </div>
          <div className="feature-box glass-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Official REST Countries v5 API</h3>
            <p>Currencies, demonyms, timezones, calling codes, borders, and coat of arms imagery fetched with authorized Bearer Token.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
