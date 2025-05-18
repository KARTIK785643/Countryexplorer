import React, { useEffect, useState } from 'react';
import './Compare.css';

const NEWS_API_KEY ='40d1061e0234434695e288699ea62778';

function Compare() {
  const [countryList, setCountryList] = useState([]);
  const [country1, setCountry1] = useState('');
  const [country2, setCountry2] = useState('');
  const [details1, setDetails1] = useState(null);
  const [details2, setDetails2] = useState(null);
  const [news1, setNews1] = useState([]);
  const [news2, setNews2] = useState([]);

  useEffect(() => {
    // Fetch all countries and sort
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const sorted = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountryList(sorted);
      });
  }, []);

  const fetchNews = async (countryName, setNews) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(countryName)}&pageSize=5&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'ok') {
        setNews(data.articles);
      } else {
        setNews([]);
      }
    } catch {
      setNews([]);
    }
  };

  const handleCompare = async () => {
    if (country1 && country2 && country1 !== country2) {
      const res1 = await fetch(`https://restcountries.com/v3.1/name/${country1}?fullText=true`);
      const res2 = await fetch(`https://restcountries.com/v3.1/name/${country2}?fullText=true`);
      const data1 = await res1.json();
      const data2 = await res2.json();
      setDetails1(data1[0]);
      setDetails2(data2[0]);
      fetchNews(country1, setNews1);
      fetchNews(country2, setNews2);
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
  <p><strong>Population:</strong> {detail.population.toLocaleString()}</p>
  <p><strong>Area:</strong> {detail.area.toLocaleString()} km²</p>
  <p><strong>Region:</strong> {detail.region}</p>
  <p><strong>Subregion:</strong> {detail.subregion}</p>
  <p><strong>Continent(s):</strong> {detail.continents?.join(', ') || 'N/A'}</p>
  <p><strong>Languages:</strong> {detail.languages ? Object.values(detail.languages).join(', ') : 'N/A'}</p>
  <p><strong>Currency:</strong> {detail.currencies ? Object.values(detail.currencies)[0].name : 'N/A'}</p>
  <p><strong>Timezones:</strong> {detail.timezones?.join(', ') || 'N/A'}</p>
  <p><strong>Borders:</strong> {detail.borders ? detail.borders.join(', ') : 'None'}</p>
  <p><strong>Demonyms:</strong> {detail.demonyms ? detail.demonyms.eng.m : 'N/A'}</p>
  <p><strong>Independent:</strong> {detail.independent ? 'Yes' : 'No'}</p>
  <p><strong>Start of Week:</strong> {detail.startOfWeek}</p>

  {/* New additions */}
  <p><strong>Government:</strong> {detail.government || 'N/A'}</p>
  <p><strong>UN Member:</strong> {detail.unMember ? 'Yes' : 'No'}</p>
  <p><strong>Driving Side:</strong> {detail.car?.side || 'N/A'}</p>
  <p><strong>Internet TLD:</strong> {detail.tld?.join(', ') || 'N/A'}</p>
  <p><strong>Calling Code(s):</strong> {detail.idd ? `${detail.idd.root}${detail.idd.suffixes?.join(', ')}` : 'N/A'}</p>
  <p><strong>Elevation (max):</strong> {detail.elevationMaxMeters ? `${detail.elevationMaxMeters} meters` : 'N/A'}</p>
  <p><strong>Elevation (min):</strong> {detail.elevationMinMeters ? `${detail.elevationMinMeters} meters` : 'N/A'}</p>
  <p><strong>Postal Code Format:</strong> {detail.postalCode?.format || 'N/A'}</p>

  {detail.coatOfArms?.png && <img src={detail.coatOfArms.png} alt="Coat of Arms" className="coat-of-arms" />}
  <img src={detail.flags.svg} alt={`${detail.name.common} flag`} width="120" className="flag-img" />
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
            <a href={news.url} target="_blank" rel="noreferrer">{news.title}</a>
            <p>{news.source.name} - {new Date(news.publishedAt).toLocaleDateString()}</p>
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
