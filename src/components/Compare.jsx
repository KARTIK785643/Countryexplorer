import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FaExchangeAlt, 
  FaSearch, 
  FaTimes, 
  FaChevronDown, 
  FaTrophy, 
  FaLandmark, 
  FaUsers, 
  FaGlobeAmericas, 
  FaMoneyBillWave, 
  FaNewspaper, 
  FaExternalLinkAlt,
  FaPhoneAlt
} from 'react-icons/fa';
import { fetchAllCountries, fetchCountryDetails } from '../services/countryApi';
import './Compare.css';

const NEWS_API_KEY = 'pub_87802c80a0a4191d5294567568f3af8f3240a';

// Custom Searchable Dropdown Component
function SearchableCountrySelect({ label, placeholder, value, onChange, countryList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = countryList.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountryObj = countryList.find(c => c.name.toLowerCase() === (value || '').toLowerCase());

  return (
    <div className="searchable-select-container" ref={dropdownRef}>
      <label className="select-label">{label}</label>
      <div 
        className={`select-trigger glass-card ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-value">
          {selectedCountryObj ? (
            <>
              {selectedCountryObj.flag && (
                <img src={selectedCountryObj.flag} alt="" className="select-flag-img" />
              )}
              <span>{selectedCountryObj.name}</span>
            </>
          ) : (
            <span className="select-placeholder">{value || placeholder}</span>
          )}
        </div>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div className="select-dropdown glass-card animate-fade-in">
          <div className="dropdown-search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Type country name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <FaTimes className="clear-icon" onClick={() => setSearch('')} />
            )}
          </div>

          <div className="dropdown-options-list">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`dropdown-option ${item.name.toLowerCase() === (value || '').toLowerCase() ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(item.name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {item.flag && (
                    <img src={item.flag} alt="" className="option-flag-img" />
                  )}
                  <span>{item.name}</span>
                </div>
              ))
            ) : (
              <div className="no-options">No matching country found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Compare() {
  const [searchParams] = useSearchParams();
  const [countryList, setCountryList] = useState([]);
  const [country1, setCountry1] = useState(searchParams.get('c1') || 'United States');
  const [country2, setCountry2] = useState(searchParams.get('c2') || 'India');
  
  const [details1, setDetails1] = useState(null);
  const [details2, setDetails2] = useState(null);
  const [news1, setNews1] = useState([]);
  const [news2, setNews2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch full country list on mount
  useEffect(() => {
    fetchAllCountries()
      .then(list => {
        if (list && list.length > 0) {
          setCountryList(list);
        }
      })
      .catch(err => {
        console.warn('Country list fetch warning:', err);
      });
  }, []);

  // Safe News fetch logic with try/catch to avoid unhandled CORS/Network errors
  const fetchNews = async (countryName, setNews) => {
    try {
      const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(countryName)}&language=en&category=top`;
      const response = await fetch(url).catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setNews(data.results.slice(0, 4));
          return;
        }
      }
      setNews([]);
    } catch {
      setNews([]);
    }
  };

  // Perform comparison fetch using CORS-safe v5 API helper
  const executeComparison = async (c1, c2) => {
    if (!c1 || !c2) return;
    if (c1.toLowerCase() === c2.toLowerCase()) {
      setErrorMsg('Please select two different countries for comparison.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const [d1, d2] = await Promise.all([
        fetchCountryDetails(c1),
        fetchCountryDetails(c2)
      ]);

      if (!d1 || !d2) {
        throw new Error('Could not retrieve details for selected countries.');
      }

      setDetails1(d1);
      setDetails2(d2);

      fetchNews(c1, setNews1);
      fetchNews(c2, setNews2);
    } catch (err) {
      console.warn('Comparison fetch notice:', err);
      setErrorMsg('Unable to fetch detailed country data. Please verify selections.');
    } finally {
      setLoading(false);
    }
  };

  // Auto execute comparison on initial load or when selections change
  useEffect(() => {
    if (country1 && country2 && country1.toLowerCase() !== country2.toLowerCase()) {
      executeComparison(country1, country2);
    }
  }, []);

  const handleSelectCountry1 = (selectedName) => {
    setCountry1(selectedName);
    if (selectedName && country2 && selectedName.toLowerCase() !== country2.toLowerCase()) {
      executeComparison(selectedName, country2);
    }
  };

  const handleSelectCountry2 = (selectedName) => {
    setCountry2(selectedName);
    if (country1 && selectedName && country1.toLowerCase() !== selectedName.toLowerCase()) {
      executeComparison(country1, selectedName);
    }
  };

  const handleSwap = () => {
    const temp = country1;
    setCountry1(country2);
    setCountry2(temp);
    if (country2 && temp) {
      executeComparison(country2, temp);
    }
  };

  // Visual Bar ratio calculator
  const calculateBarPercentages = (val1, val2) => {
    if (!val1 || !val2) return { p1: 50, p2: 50, winner: 0 };
    const num1 = Number(val1);
    const num2 = Number(val2);
    const total = num1 + num2;
    if (total === 0) return { p1: 50, p2: 50, winner: 0 };
    const p1 = Math.round((num1 / total) * 100);
    const p2 = 100 - p1;
    const winner = num1 > num2 ? 1 : num2 > num1 ? 2 : 0;
    return { p1, p2, winner };
  };

  const popRatios = details1 && details2 ? calculateBarPercentages(details1.population, details2.population) : null;
  const areaRatios = details1 && details2 ? calculateBarPercentages(details1.area, details2.area) : null;

  return (
    <div className="compare-dashboard animate-fade-in">
      {/* Top Header */}
      <div className="compare-header">
        <h1>Side-by-Side <span className="gradient-text">Country Analyzer</span></h1>
        <p>Type to search and select any two nations to analyze demographics, economy, geography & news.</p>
      </div>

      {/* Selectors Bar */}
      <div className="selectors-card glass-card">
        <div className="selectors-row">
          <SearchableCountrySelect 
            label="First Country"
            placeholder="Search 1st Country..."
            value={country1}
            onChange={handleSelectCountry1}
            countryList={countryList}
          />

          <button className="swap-btn" onClick={handleSwap} title="Swap Countries">
            <FaExchangeAlt />
          </button>

          <SearchableCountrySelect 
            label="Second Country"
            placeholder="Search 2nd Country..."
            value={country2}
            onChange={handleSelectCountry2}
            countryList={countryList}
          />

          <button className="btn-primary compare-submit-btn" onClick={() => executeComparison(country1, country2)}>
            <FaSearch /> Analyze Pair
          </button>
        </div>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="loading-container glass-card">
          <div className="spinner"></div>
          <p>Fetching geopolitical data & news feeds...</p>
        </div>
      )}

      {/* Main Comparative View */}
      {!loading && details1 && details2 && (
        <div className="comparison-results">
          {/* Visual Comparison Progress Bars */}
          <div className="visual-metrics-section glass-card">
            <div className="visual-metrics-header">
              <h2>Visual Indicator Comparison</h2>

              {/* Color Legend for Countries */}
              <div className="chart-legend-bar">
                <div className="legend-item legend-1">
                  <span className="color-dot dot-1"></span>
                  {details1.flag && <img src={details1.flag} alt="" className="legend-flag" />}
                  <span className="legend-country-name">{details1.name}</span>
                </div>
                <div className="legend-vs">VS</div>
                <div className="legend-item legend-2">
                  <span className="color-dot dot-2"></span>
                  {details2.flag && <img src={details2.flag} alt="" className="legend-flag" />}
                  <span className="legend-country-name">{details2.name}</span>
                </div>
              </div>
            </div>

            {/* Population Bar */}
            <div className="metric-comparison-group">
              <div className="metric-group-header">
                <span><FaUsers /> Total Population</span>
                <div className="metric-values">
                  <span className={`country-metric-tag c1-tag ${popRatios.winner === 1 ? 'leader' : ''}`}>
                    <span className="dot dot-1"></span>
                    {details1.name}: <strong>{details1.population?.toLocaleString()}</strong>
                  </span>
                  <span className="vs-divider">vs</span>
                  <span className={`country-metric-tag c2-tag ${popRatios.winner === 2 ? 'leader' : ''}`}>
                    <span className="dot dot-2"></span>
                    {details2.name}: <strong>{details2.population?.toLocaleString()}</strong>
                  </span>
                </div>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill fill-1" 
                  style={{ width: `${popRatios.p1}%` }} 
                  title={`${details1.name}: ${popRatios.p1}%`}
                >
                  {popRatios.p1 >= 15 ? `${details1.name} • ${popRatios.p1}%` : `${popRatios.p1}%`}
                </div>
                <div 
                  className="progress-bar-fill fill-2" 
                  style={{ width: `${popRatios.p2}%` }} 
                  title={`${details2.name}: ${popRatios.p2}%`}
                >
                  {popRatios.p2 >= 15 ? `${details2.name} • ${popRatios.p2}%` : `${popRatios.p2}%`}
                </div>
              </div>
              {popRatios.winner !== 0 && (
                <div className="winner-tag">
                  <FaTrophy /> <strong>{popRatios.winner === 1 ? details1.name : details2.name}</strong> has a larger population ({popRatios.winner === 1 ? popRatios.p1 : popRatios.p2}% ratio)
                </div>
              )}
            </div>

            {/* Land Area Bar */}
            <div className="metric-comparison-group">
              <div className="metric-group-header">
                <span><FaGlobeAmericas /> Total Land Area</span>
                <div className="metric-values">
                  <span className={`country-metric-tag c1-tag ${areaRatios.winner === 1 ? 'leader' : ''}`}>
                    <span className="dot dot-1"></span>
                    {details1.name}: <strong>{details1.area?.toLocaleString()} km²</strong>
                  </span>
                  <span className="vs-divider">vs</span>
                  <span className={`country-metric-tag c2-tag ${areaRatios.winner === 2 ? 'leader' : ''}`}>
                    <span className="dot dot-2"></span>
                    {details2.name}: <strong>{details2.area?.toLocaleString()} km²</strong>
                  </span>
                </div>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill fill-1" 
                  style={{ width: `${areaRatios.p1}%` }} 
                  title={`${details1.name}: ${areaRatios.p1}%`}
                >
                  {areaRatios.p1 >= 15 ? `${details1.name} • ${areaRatios.p1}%` : `${areaRatios.p1}%`}
                </div>
                <div 
                  className="progress-bar-fill fill-2" 
                  style={{ width: `${areaRatios.p2}%` }} 
                  title={`${details2.name}: ${areaRatios.p2}%`}
                >
                  {areaRatios.p2 >= 15 ? `${details2.name} • ${areaRatios.p2}%` : `${areaRatios.p2}%`}
                </div>
              </div>
              {areaRatios.winner !== 0 && (
                <div className="winner-tag">
                  <FaTrophy /> <strong>{areaRatios.winner === 1 ? details1.name : details2.name}</strong> spans a larger land area ({areaRatios.winner === 1 ? areaRatios.p1 : areaRatios.p2}% ratio)
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Country Cards Grid */}
          <div className="country-cards-comparison">
            {/* Country 1 Card */}
            <div className="country-detail-card glass-card">
              <div className="country-header-banner">
                {details1.flag && (
                  <img src={details1.flag} alt={`${details1.name} flag`} className="main-flag-img" />
                )}
                <div className="country-name-block">
                  <h2>{details1.name} <span className="native-title">{details1.officialName}</span></h2>
                  <span className="region-badge">{details1.region} • {details1.subregion || 'N/A'}</span>
                </div>
              </div>

              {/* Categorized Metrics */}
              <div className="metrics-category-block">
                <h3><FaLandmark /> Demographics & Geography</h3>
                <div className="detail-row"><span>Capital:</span> <strong>{details1.capital}</strong></div>
                <div className="detail-row"><span>Population:</span> <strong>{details1.population?.toLocaleString()}</strong></div>
                <div className="detail-row"><span>Area:</span> <strong>{details1.area?.toLocaleString()} km²</strong></div>
                <div className="detail-row"><span>Continent(s):</span> <strong>{details1.continents?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Borders:</span> <strong>{details1.borders?.length > 0 ? details1.borders.join(', ') : 'None (Island)'}</strong></div>
              </div>

              <div className="metrics-category-block">
                <h3><FaMoneyBillWave /> Governance & Economy</h3>
                <div className="detail-row"><span>Currencies:</span> <strong>{details1.currencies}</strong></div>
                <div className="detail-row"><span>Languages:</span> <strong>{details1.languages}</strong></div>
                <div className="detail-row"><span>UN Member:</span> <strong>{details1.unMember ? 'Yes ✅' : 'No ❌'}</strong></div>
                <div className="detail-row"><span>Independent:</span> <strong>{details1.independent ? 'Yes ✅' : 'No ❌'}</strong></div>
                <div className="detail-row"><span>Driving Side:</span> <strong className="capitalize">{details1.drivingSide}</strong></div>
              </div>

              <div className="metrics-category-block">
                <h3><FaPhoneAlt /> Connectivity & Details</h3>
                <div className="detail-row"><span>Calling Code:</span> <strong>{details1.callingCodes?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Internet TLD:</span> <strong>{details1.tld?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Timezones:</span> <strong>{details1.timezones?.slice(0, 3).join(', ')} {details1.timezones?.length > 3 ? '...' : ''}</strong></div>
              </div>

              {/* Coat of Arms */}
              {details1.coatOfArms && (
                <div className="coat-of-arms-box">
                  <span>Coat of Arms</span>
                  <img src={details1.coatOfArms} alt="Coat of Arms" className="coat-img" />
                </div>
              )}

              {/* News Section 1 */}
              <div className="news-section">
                <h3><FaNewspaper /> Latest News in {details1.name}</h3>
                {news1.length > 0 ? (
                  <div className="news-list">
                    {news1.map((item, idx) => (
                      <div key={idx} className="news-card">
                        <a href={item.link || item.url} target="_blank" rel="noreferrer" className="news-title">
                          {item.title} <FaExternalLinkAlt className="ext-icon" />
                        </a>
                        <div className="news-meta">
                          <span>{item.source_id || 'Top News'}</span>
                          <span>•</span>
                          <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-news-text">No recent live news articles fetched for this region.</p>
                )}
              </div>
            </div>

            {/* Country 2 Card */}
            <div className="country-detail-card glass-card">
              <div className="country-header-banner">
                {details2.flag && (
                  <img src={details2.flag} alt={`${details2.name} flag`} className="main-flag-img" />
                )}
                <div className="country-name-block">
                  <h2>{details2.name} <span className="native-title">{details2.officialName}</span></h2>
                  <span className="region-badge">{details2.region} • {details2.subregion || 'N/A'}</span>
                </div>
              </div>

              {/* Categorized Metrics */}
              <div className="metrics-category-block">
                <h3><FaLandmark /> Demographics & Geography</h3>
                <div className="detail-row"><span>Capital:</span> <strong>{details2.capital}</strong></div>
                <div className="detail-row"><span>Population:</span> <strong>{details2.population?.toLocaleString()}</strong></div>
                <div className="detail-row"><span>Area:</span> <strong>{details2.area?.toLocaleString()} km²</strong></div>
                <div className="detail-row"><span>Continent(s):</span> <strong>{details2.continents?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Borders:</span> <strong>{details2.borders?.length > 0 ? details2.borders.join(', ') : 'None (Island)'}</strong></div>
              </div>

              <div className="metrics-category-block">
                <h3><FaMoneyBillWave /> Governance & Economy</h3>
                <div className="detail-row"><span>Currencies:</span> <strong>{details2.currencies}</strong></div>
                <div className="detail-row"><span>Languages:</span> <strong>{details2.languages}</strong></div>
                <div className="detail-row"><span>UN Member:</span> <strong>{details2.unMember ? 'Yes ✅' : 'No ❌'}</strong></div>
                <div className="detail-row"><span>Independent:</span> <strong>{details2.independent ? 'Yes ✅' : 'No ❌'}</strong></div>
                <div className="detail-row"><span>Driving Side:</span> <strong className="capitalize">{details2.drivingSide}</strong></div>
              </div>

              <div className="metrics-category-block">
                <h3><FaPhoneAlt /> Connectivity & Details</h3>
                <div className="detail-row"><span>Calling Code:</span> <strong>{details2.callingCodes?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Internet TLD:</span> <strong>{details2.tld?.join(', ') || 'N/A'}</strong></div>
                <div className="detail-row"><span>Timezones:</span> <strong>{details2.timezones?.slice(0, 3).join(', ')} {details2.timezones?.length > 3 ? '...' : ''}</strong></div>
              </div>

              {/* Coat of Arms */}
              {details2.coatOfArms && (
                <div className="coat-of-arms-box">
                  <span>Coat of Arms</span>
                  <img src={details2.coatOfArms} alt="Coat of Arms" className="coat-img" />
                </div>
              )}

              {/* News Section 2 */}
              <div className="news-section">
                <h3><FaNewspaper /> Latest News in {details2.name}</h3>
                {news2.length > 0 ? (
                  <div className="news-list">
                    {news2.map((item, idx) => (
                      <div key={idx} className="news-card">
                        <a href={item.link || item.url} target="_blank" rel="noreferrer" className="news-title">
                          {item.title} <FaExternalLinkAlt className="ext-icon" />
                        </a>
                        <div className="news-meta">
                          <span>{item.source_id || 'Top News'}</span>
                          <span>•</span>
                          <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-news-text">No recent live news articles fetched for this region.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
