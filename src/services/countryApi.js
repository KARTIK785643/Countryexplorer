// Country API service supporting proxy fallback to prevent CORS browser errors
const API_TOKEN = 'Bearer rc_live_48b2754f9e7b482883c0d1e2a62a24ae';

// Determine if we should use local proxy path or direct URL
const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const V5_ENDPOINT = isDev ? '/api-restcountries/countries/v5' : 'https://api.restcountries.com/countries/v5';
const V3_ENDPOINT = isDev ? '/restcountries-v3/v3.1' : 'https://restcountries.com/v3.1';

const getHeaders = () => ({
  'Authorization': API_TOKEN,
  'Content-Type': 'application/json'
});

// Embedded fallback database for popular countries (Guarantees zero-failure search & comparison even if CORS/offline)
const STATIC_COUNTRIES_DB = [
  {
    name: 'United States', officialName: 'United States of America', flag: 'https://flags.restcountries.com/v5/svg/us.svg', emoji: '🇺🇸',
    capital: 'Washington, D.C.', region: 'Americas', subregion: 'North America', population: 331449281, area: 9372610,
    continents: ['North America'], currencies: 'United States dollar ($)', languages: 'English', borders: ['CAN', 'MEX'],
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00'],
    demonyms: 'American', unMember: true, independent: true, drivingSide: 'right', tld: ['.us'], callingCodes: ['+1'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/us.png'
  },
  {
    name: 'India', officialName: 'Republic of India', flag: 'https://flags.restcountries.com/v5/svg/in.svg', emoji: '🇮🇳',
    capital: 'New Delhi', region: 'Asia', subregion: 'Southern Asia', population: 1380004385, area: 3287590,
    continents: ['Asia'], currencies: 'Indian rupee (₹)', languages: 'Hindi, English', borders: ['BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
    timezones: ['UTC+05:30'], demonyms: 'Indian', unMember: true, independent: true, drivingSide: 'left', tld: ['.in'], callingCodes: ['+91'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/in.png'
  },
  {
    name: 'Canada', officialName: 'Canada', flag: 'https://flags.restcountries.com/v5/svg/ca.svg', emoji: '🇨🇦',
    capital: 'Ottawa', region: 'Americas', subregion: 'North America', population: 38005238, area: 9984670,
    continents: ['North America'], currencies: 'Canadian dollar ($)', languages: 'English, French', borders: ['USA'],
    timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:30'], demonyms: 'Canadian',
    unMember: true, independent: true, drivingSide: 'right', tld: ['.ca'], callingCodes: ['+1'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/ca.png'
  },
  {
    name: 'United Kingdom', officialName: 'United Kingdom of Great Britain and Northern Ireland', flag: 'https://flags.restcountries.com/v5/svg/gb.svg', emoji: '🇬🇧',
    capital: 'London', region: 'Europe', subregion: 'Northern Europe', population: 67215293, area: 242900,
    continents: ['Europe'], currencies: 'British pound (£)', languages: 'English', borders: ['IRL'],
    timezones: ['UTC-08:00', 'UTC-05:00', 'UTC-02:00', 'UTC', 'UTC+01:00', 'UTC+02:00', 'UTC+06:00'], demonyms: 'British',
    unMember: true, independent: true, drivingSide: 'left', tld: ['.uk'], callingCodes: ['+44'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/gb.png'
  },
  {
    name: 'Japan', officialName: 'Japan', flag: 'https://flags.restcountries.com/v5/svg/jp.svg', emoji: '🇯🇵',
    capital: 'Tokyo', region: 'Asia', subregion: 'Eastern Asia', population: 125836021, area: 377930,
    continents: ['Asia'], currencies: 'Japanese yen (¥)', languages: 'Japanese', borders: [],
    timezones: ['UTC+09:00'], demonyms: 'Japanese', unMember: true, independent: true, drivingSide: 'left', tld: ['.jp'], callingCodes: ['+81'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/jp.png'
  },
  {
    name: 'Germany', officialName: 'Federal Republic of Germany', flag: 'https://flags.restcountries.com/v5/svg/de.svg', emoji: '🇩🇪',
    capital: 'Berlin', region: 'Europe', subregion: 'Western Europe', population: 83240525, area: 357114,
    continents: ['Europe'], currencies: 'Euro (€)', languages: 'German', borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    timezones: ['UTC+01:00'], demonyms: 'German', unMember: true, independent: true, drivingSide: 'right', tld: ['.de'], callingCodes: ['+49'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/de.png'
  },
  {
    name: 'Australia', officialName: 'Commonwealth of Australia', flag: 'https://flags.restcountries.com/v5/svg/au.svg', emoji: '🇦🇺',
    capital: 'Canberra', region: 'Oceania', subregion: 'Australia and New Zealand', population: 25687041, area: 7692024,
    continents: ['Oceania'], currencies: 'Australian dollar ($)', languages: 'English', borders: [],
    timezones: ['UTC+05:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00'], demonyms: 'Australian',
    unMember: true, independent: true, drivingSide: 'left', tld: ['.au'], callingCodes: ['+61'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/au.png'
  },
  {
    name: 'Brazil', officialName: 'Federative Republic of Brazil', flag: 'https://flags.restcountries.com/v5/svg/br.svg', emoji: '🇧🇷',
    capital: 'Brasília', region: 'Americas', subregion: 'South America', population: 212559409, area: 8515767,
    continents: ['South America'], currencies: 'Brazilian real (R$)', languages: 'Portuguese', borders: ['ARG', 'BOL', 'COL', 'GFR', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'], demonyms: 'Brazilian',
    unMember: true, independent: true, drivingSide: 'right', tld: ['.br'], callingCodes: ['+55'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/br.png'
  },
  {
    name: 'France', officialName: 'French Republic', flag: 'https://flags.restcountries.com/v5/svg/fr.svg', emoji: '🇫🇷',
    capital: 'Paris', region: 'Europe', subregion: 'Western Europe', population: 67391582, area: 551695,
    continents: ['Europe'], currencies: 'Euro (€)', languages: 'French', borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
    timezones: ['UTC+01:00'], demonyms: 'French', unMember: true, independent: true, drivingSide: 'right', tld: ['.fr'], callingCodes: ['+33'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/fr.png'
  },
  {
    name: 'Italy', officialName: 'Italian Republic', flag: 'https://flags.restcountries.com/v5/svg/it.svg', emoji: '🇮🇹',
    capital: 'Rome', region: 'Europe', subregion: 'Southern Europe', population: 59554023, area: 301336,
    continents: ['Europe'], currencies: 'Euro (€)', languages: 'Italian', borders: ['AUT', 'FRA', 'SMR', 'SVN', 'CHE', 'VAT'],
    timezones: ['UTC+01:00'], demonyms: 'Italian', unMember: true, independent: true, drivingSide: 'right', tld: ['.it'], callingCodes: ['+39'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/it.png'
  },
  {
    name: 'South Africa', officialName: 'Republic of South Africa', flag: 'https://flags.restcountries.com/v5/svg/za.svg', emoji: '🇿🇦',
    capital: 'Pretoria', region: 'Africa', subregion: 'Southern Africa', population: 59308690, area: 1221037,
    continents: ['Africa'], currencies: 'South African rand (R)', languages: 'Afrikaans, English, Zulu, Xhosa', borders: ['BWA', 'LSO', 'MOZ', 'NAM', 'SWZ', 'ZWE'],
    timezones: ['UTC+02:00'], demonyms: 'South African', unMember: true, independent: true, drivingSide: 'left', tld: ['.za'], callingCodes: ['+27'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/za.png'
  },
  {
    name: 'Egypt', officialName: 'Arab Republic of Egypt', flag: 'https://flags.restcountries.com/v5/svg/eg.svg', emoji: '🇪🇬',
    capital: 'Cairo', region: 'Africa', subregion: 'Northern Africa', population: 102334403, area: 1002450,
    continents: ['Africa'], currencies: 'Egyptian pound (E£)', languages: 'Arabic', borders: ['ISR', 'LBY', 'SDN'],
    timezones: ['UTC+02:00'], demonyms: 'Egyptian', unMember: true, independent: true, drivingSide: 'right', tld: ['.eg'], callingCodes: ['+20'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/eg.png'
  },
  {
    name: 'China', officialName: "People's Republic of China", flag: 'https://flags.restcountries.com/v5/svg/cn.svg', emoji: '🇨🇳',
    capital: 'Beijing', region: 'Asia', subregion: 'Eastern Asia', population: 1402112000, area: 9706961,
    continents: ['Asia'], currencies: 'Chinese yuan (¥)', languages: 'Mandarin', borders: ['AFG', 'BTN', 'IND', 'KAZ', 'KGZ', 'LAO', 'MNG', 'MMR', 'NPL', 'PRK', 'PAK', 'RUS', 'TJK', 'VNM'],
    timezones: ['UTC+08:00'], demonyms: 'Chinese', unMember: true, independent: true, drivingSide: 'right', tld: ['.cn'], callingCodes: ['+86'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/cn.png'
  },
  {
    name: 'Russia', officialName: 'Russian Federation', flag: 'https://flags.restcountries.com/v5/svg/ru.svg', emoji: '🇷🇺',
    capital: 'Moscow', region: 'Europe', subregion: 'Eastern Europe', population: 144104080, area: 17098242,
    continents: ['Europe', 'Asia'], currencies: 'Russian ruble (₽)', languages: 'Russian', borders: ['AZE', 'BLR', 'CHN', 'EST', 'FIN', 'GEO', 'KAZ', 'PRK', 'LVA', 'LTU', 'MNG', 'NOR', 'POL', 'UKR'],
    timezones: ['UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'], demonyms: 'Russian',
    unMember: true, independent: true, drivingSide: 'right', tld: ['.ru'], callingCodes: ['+7'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/ru.png'
  },
  {
    name: 'Mexico', officialName: 'United Mexican States', flag: 'https://flags.restcountries.com/v5/svg/mx.svg', emoji: '🇲🇽',
    capital: 'Mexico City', region: 'Americas', subregion: 'North America', population: 128932753, area: 1964375,
    continents: ['North America'], currencies: 'Mexican peso ($)', languages: 'Spanish', borders: ['BLZ', 'GTM', 'USA'],
    timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00'], demonyms: 'Mexican', unMember: true, independent: true, drivingSide: 'right', tld: ['.mx'], callingCodes: ['+52'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/mx.png'
  },
  {
    name: 'Spain', officialName: 'Kingdom of Spain', flag: 'https://flags.restcountries.com/v5/svg/es.svg', emoji: '🇪🇸',
    capital: 'Madrid', region: 'Europe', subregion: 'Southern Europe', population: 47351567, area: 505992,
    continents: ['Europe'], currencies: 'Euro (€)', languages: 'Spanish', borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
    timezones: ['UTC', 'UTC+01:00'], demonyms: 'Spanish', unMember: true, independent: true, drivingSide: 'right', tld: ['.es'], callingCodes: ['+34'],
    coatOfArms: 'https://mainfacts.com/media/images/coats_of_arms/es.png'
  }
];

// Helper to format raw API objects
export function formatCountryData(item) {
  if (!item) return null;

  const commonName = item.names?.common || item.name?.common || item.name || 'Unknown';
  const officialName = item.names?.official || item.name?.official || commonName;

  const flagUrl = item.flag?.url_svg || item.flag?.url_png || item.flags?.svg || item.flags?.png || '';
  const flagEmoji = item.flag?.emoji || '';

  const capitalName = Array.isArray(item.capitals) && item.capitals.length > 0
    ? (typeof item.capitals[0] === 'object' ? item.capitals[0].name : item.capitals[0])
    : (Array.isArray(item.capital) ? item.capital[0] : item.capital || 'N/A');

  const populationNum = typeof item.population === 'number' ? item.population : 0;
  const areaKm = typeof item.area === 'object' && item.area !== null
    ? (item.area.kilometers || 0)
    : (typeof item.area === 'number' ? item.area : 0);

  const currenciesList = Array.isArray(item.currencies)
    ? item.currencies.map(c => `${c.name || ''} ${c.symbol ? `(${c.symbol})` : ''}`.trim()).filter(Boolean).join(', ')
    : (item.currencies && typeof item.currencies === 'object'
        ? Object.values(item.currencies).map(c => `${c.name || ''} ${c.symbol ? `(${c.symbol})` : ''}`.trim()).join(', ')
        : 'N/A');

  const languagesList = Array.isArray(item.languages)
    ? item.languages.map(l => l.name || l.native_name || '').filter(Boolean).join(', ')
    : (item.languages && typeof item.languages === 'object'
        ? Object.values(item.languages).join(', ')
        : 'N/A');

  const bordersList = Array.isArray(item.borders) ? item.borders : [];
  const timezonesList = Array.isArray(item.timezones) ? item.timezones : [];
  const continentsList = Array.isArray(item.continents) ? item.continents : [];
  const tldList = Array.isArray(item.tlds) ? item.tlds : (Array.isArray(item.tld) ? item.tld : []);

  const callingCodesList = Array.isArray(item.calling_codes)
    ? item.calling_codes.map(c => (c.startsWith('+') ? c : `+${c}`))
    : (item.idd ? [`${item.idd.root || ''}${item.idd.suffixes?.[0] || ''}`] : []);

  const demonym = item.demonyms?.eng?.m || item.demonyms?.eng?.f || 'N/A';
  const unMember = item.classification ? Boolean(item.classification.un_member) : Boolean(item.unMember);
  const independent = item.classification ? Boolean(item.classification.sovereign) : Boolean(item.independent);
  const drivingSide = item.cars?.driving_side || item.car?.side || 'N/A';

  let coatOfArmsPng = null;
  if (Array.isArray(item.assets)) {
    const coatObj = item.assets.find(a => a.type === 'coat_of_arms' || a.name === 'coat_of_arms');
    coatOfArmsPng = coatObj?.url_png || coatObj?.url_svg || null;
  }
  if (!coatOfArmsPng && item.coatOfArms) {
    coatOfArmsPng = item.coatOfArms.png || item.coatOfArms.svg || null;
  }

  return {
    name: commonName,
    officialName: officialName,
    flag: flagUrl,
    emoji: flagEmoji,
    capital: capitalName,
    region: item.region || 'World',
    subregion: item.subregion || 'N/A',
    population: populationNum,
    area: areaKm,
    continents: continentsList,
    currencies: currenciesList || 'N/A',
    languages: languagesList || 'N/A',
    borders: bordersList,
    timezones: timezonesList,
    demonyms: demonym,
    unMember,
    independent,
    drivingSide,
    tld: tldList,
    callingCodes: callingCodesList,
    coatOfArms: coatOfArmsPng,
    raw: item
  };
}

// Fetch complete country list (Attempts v5 proxy -> v3 proxy -> static database fallback)
export async function fetchAllCountries() {
  // 1. Try v5 API endpoint (via proxy or direct)
  try {
    const res = await fetch(`${V5_ENDPOINT}?limit=100&offset=0`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.objects && data.data.objects.length > 0) {
        // Fetch remaining pages in background or combine
        const p1 = data.data.objects;
        const [r2, r3] = await Promise.all([
          fetch(`${V5_ENDPOINT}?limit=100&offset=100`, { headers: getHeaders() }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${V5_ENDPOINT}?limit=100&offset=200`, { headers: getHeaders() }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);
        const p2 = r2?.data?.objects || [];
        const p3 = r3?.data?.objects || [];
        const combined = [...p1, ...p2, ...p3];
        return combined.map(formatCountryData).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  } catch (err) {
    console.warn('V5 fetch failed, trying V3 proxy fallback:', err);
  }

  // 2. Try REST Countries v3.1 endpoint (via proxy or direct)
  try {
    const resV3 = await fetch(`${V3_ENDPOINT}/all`);
    if (resV3.ok) {
      const dataV3 = await resV3.json();
      if (Array.isArray(dataV3) && dataV3.length > 0) {
        return dataV3.map(formatCountryData).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  } catch (err) {
    console.warn('V3 fallback failed, using static database:', err);
  }

  // 3. Guaranteed Static Fallback Database
  return STATIC_COUNTRIES_DB.sort((a, b) => a.name.localeCompare(b.name));
}

// Fetch details for single country
export async function fetchCountryDetails(countryName) {
  if (!countryName) return null;
  const cleanName = countryName.trim();

  // First check static database for instant zero-latency match
  const staticMatch = STATIC_COUNTRIES_DB.find(
    c => c.name.toLowerCase() === cleanName.toLowerCase()
  );

  // 1. Try v5 API endpoint
  try {
    const url = `${V5_ENDPOINT}?q=${encodeURIComponent(cleanName)}`;
    const response = await fetch(url, { headers: getHeaders() });
    if (response.ok) {
      const json = await response.json();
      if (json?.data?.objects && json.data.objects.length > 0) {
        const objects = json.data.objects;
        const exactMatch = objects.find(o => 
          o.names?.common?.toLowerCase() === cleanName.toLowerCase()
        );
        return formatCountryData(exactMatch || objects[0]);
      }
    }
  } catch (err) {
    console.warn(`V5 query failed for ${cleanName}, trying V3 fallback:`, err);
  }

  // 2. Try v3.1 fallback
  try {
    const resV3 = await fetch(`${V3_ENDPOINT}/name/${encodeURIComponent(cleanName)}?fullText=true`);
    if (resV3.ok) {
      const dataV3 = await resV3.json();
      if (Array.isArray(dataV3) && dataV3.length > 0) {
        return formatCountryData(dataV3[0]);
      }
    }
  } catch (err) {
    console.warn(`V3 query failed for ${cleanName}:`, err);
  }

  // 3. Return static database match or null
  return staticMatch || null;
}
