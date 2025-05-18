import React, { useEffect, useState } from 'react';
import './Compare.css';

const NEWS_API_KEY = 'pub_87802c80a0a4191d5294567568f3af8f3240a';

function Compare() {
  const [countryList, setCountryList] = useState([]);
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [details1, setDetails1] = useState(null);
  const [details2, setDetails2] = useState(null);
  const [news1, setNews1] = useState([]);
  const [news2, setNews2] = useState([]);

  useEffect(() => {
    // Fetch all countries and sort alphabetically
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const sorted = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountryList(sorted);
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  const fetchNews = async (countryName, setNews) => {
    try {
      const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(countryName)}&language=en&category=top`;
      const response = await fetch(url);
      const data = await response.json();

      console.log('News API response for', countryName, ':', data);

      if (data.results) {
        setNews(data.results);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
  };

  const handleCompare = async () => {
    if (country1 && country2 && country1 !== country2) {
      try {
        const res1 = await fetch(`https://restcountries.com/v3.1/name/${country1}?fullText=true`);
        const res2 = await fetch(`https://restcountries.com/v3.1/name/${country2}?fullText=true`);
        const data1 = await res1.json();
        const data2 = await res2.json();
        setDetails1(data1[0]);
        setDetails2(data2[0]);
        fetchNews(country1, setNews1);
        fetchNews(country2, setNews2);
      } catch (error) {
        console.error('Error fetching country details:', error);
        alert('Failed to fetch country details. Please try again.');
      }
    } else {
      alert('Please select two different countries.');
    }
  };

  const renderCountryInfo = (detail) => {
    if (!detail) return null;
    return (
      <>
        <h2>{detail.name.common} {detail.flag ? detail.flag : ''}</h2>
        <p><strong>Capital:</strong> {detail.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> {detail.population?.toLocaleString() || 'N/A'}</p>
        <p><strong>Area:</strong> {detail.area?.toLocaleString() || 'N/A'} km²</p>
        <p><strong>Region:</strong> {detail.region || 'N/A'}</p>
        <p><strong>Subregion:</strong> {detail.subregion || 'N/A'}</p>
        <p><strong>Continent(s):</strong> {detail.continents?.join(', ') || 'N/A'}</p>
        <p><strong>Languages:</strong> {detail.languages ? Object.values(detail.languages).join(', ') : 'N/A'}</p>
        <p><strong>Currency:</strong> {detail.currencies ? Object.values(detail.currencies)[0].name : 'N/A'}</p>
        <p><strong>Timezones:</strong> {detail.timezones?.join(', ') || 'N/A'}</p>
        <p><strong>Borders:</strong> {detail.borders ? detail.borders.join(', ') : 'None'}</p>
        <p><strong>Demonyms:</strong> {detail.demonyms?.eng?.m || 'N/A'}</p>
        <p><strong>Independent:</strong> {detail.independent ? 'Yes' : 'No'}</p>
        <p><strong>Start of Week:</strong> {detail.startOfWeek || 'N/A'}</p>

        {/* Additional properties */}
        <p><strong>Government:</strong> {detail.government || 'N/A'}</p>
        <p><strong>UN Member:</strong> {detail.unMember ? 'Yes' : 'No'}</p>
        <p><strong>Driving Side:</strong> {detail.car?.side || 'N/A'}</p>
        <p><strong>Internet TLD:</strong> {detail.tld?.join(', ') || 'N/A'}</p>
        <p><strong>Calling Code(s):</strong> {detail.idd ? `${detail.idd.root}${detail.idd.suffixes?.join(', ')}` : 'N/A'}</p>
        <p><strong>Elevation (max):</strong> {detail.elevationMaxMeters ? `${detail.elevationMaxMeters} meters` : 'N/A'}</p>
        <p><strong>Elevation (min):</strong> {detail.elevationMinMeters ? `${detail.elevationMinMeters} meters` : 'N/A'}</p>
        <p><strong>Postal Code Format:</strong> {detail.postalCode?.format || 'N/A'}</p>

        {detail.coatOfArms?.png && <img src={detail.coatOfArms.png} alt="Coat of Arms" className="coat-of-arms" />}
        {detail.flags?.svg && <img src={detail.flags.svg} alt={`${detail.name.common} flag`} width="120" className="flag-img" />}
      </>
    );
  };

  const renderNews = (newsList) => {
    if (!newsList.length) {
      return <p>No recent news found.</p>;
    }
    return (
      <div className="news-container">
        <h3>Latest News</h3>
        {newsList.map((news, index) => (
          <div key={index} className="news-item">
            <a href={news.link || news.url} target="_blank" rel="noreferrer">{news.title}</a>
            <p>{news.source_id || news.source?.name || 'Unknown source'} - {news.pubDate ? new Date(news.pubDate).toLocaleDateString() : news.pubDate}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="compare-container">
      <h1>Country Comparison System</h1>

      <div className="selectors">
        <select value={country1} onChange={(e) => setCountry1(e.target.value)}>
          <option value="">Select First Country</option>
          {countryList.map((country, i) => (
            <option key={i} value={country}>{country}</option>
          ))}
        </select>

        <select value={country2} onChange={(e) => setCountry2(e.target.value)}>
          <option value="">Select Second Country</option>
          {countryList.map((country, i) => (
            <option key={i} value={country}>{country}</option>
          ))}
        </select>

        <button onClick={handleCompare}>Explore</button>
      </div>

      {details1 && details2 && (
        <div className="comparison-box">
          <div className="country-box">
            {renderCountryInfo(details1)}
            {renderNews(news1)}
          </div>
          <div className="country-box">
            {renderCountryInfo(details2)}
            {renderNews(news2)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
