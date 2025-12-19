# Day 13: API Integration

API integration is a crucial skill in modern React development. You'll fetch real-world data and handle asynchronous states properly.

We’ll cover:
- `fetch` (built-in) and `axios` (popular library)
- Managing **loading**, **success**, and **error** states
- Best practices

## 1. Fetching Data from APIs Using fetch and axios

### Option 1: Native fetch

```jsx
useEffect(() => {
  fetch('https://api.example.com/data')     // Built-in fetch
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();                 // Parse JSON
    })
    .then(data => setData(data))            // Success
    .catch(err => setError(err.message));   // Error
}, []);
```

### Option 2: axios (Recommended for most projects)

Install:
```bash
npm install axios
```

```jsx
import axios from 'axios';

useEffect(() => {
  axios.get('https://api.example.com/data') // Cleaner syntax
    .then(response => setData(response.data))
    .catch(err => setError(err.message));
}, []);
```

**Why axios?**
- Automatic JSON parsing
- Better error handling
- Request/response interceptors
- Cancel tokens

## 2. Handling Loading States and Errors

Always manage three states:
- **Loading** (fetching)
- **Success** (data received)
- **Error** (something went wrong)

### Example: Complete Data Fetching with States

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataFetcher() {
  const [data, setData] = useState(null);      // Fetched data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null);    // Error message

  useEffect(() => {
    setLoading(true);                          // Start loading
    setError(null);                            // Clear previous error

    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setData(response.data.slice(0, 5));    // Take first 5 posts
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      });
  }, []);

  // Conditional rendering
  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {data.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetcher;
```

**Best Practices:**
- Reset error/loading on new request
- Show user-friendly messages
- Use skeletons or spinners for better UX

## Hands-On Solution: Weather App

**Requirement:**  
Build a weather app that fetches current weather data for a city using a free API.

We’ll use **OpenWeatherMap API** (free tier).

1. Get free API key: https://openweathermap.org/api
2. Example endpoint:  
   `https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric`

### Complete Weather App with Comments

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function WeatherApp() {
  const [city, setCity] = useState('');           // Input city
  const [weather, setWeather] = useState(null);   // Fetched weather data
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState('');         // Error message

  // Replace with your actual API key
  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';   // Get from openweathermap.org

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(response.data);                   // Success: store data
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'City not found or API error');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '12px',
      backgroundColor: '#f9f9f9'
    }}>
      <h1>Weather App 🌤️</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., Kathmandu)"
          style={{
            padding: '12px',
            width: '70%',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #aaa'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            marginLeft: '10px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {weather && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#e3f2fd',
          borderRadius: '10px'
        }}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p style={{ fontSize: '48px', margin: '10px 0' }}>
            {Math.round(weather.main.temp)}°C
          </p>
          <p style={{ textTransform: 'capitalize' }}>
            {weather.weather[0].description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}

      {!weather && !loading && !error && (
        <p style={{ marginTop: '40px', color: '#666' }}>
          Search for a city to see weather information
        </p>
      )}
    </div>
  );
}

export default WeatherApp;
```

**Features:**
- Search by city name
- Loading state
- Error handling (invalid city, API issues)
- Clean display of temperature, description, humidity, wind
- Responsive input

> **Note:** Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual key.

## 10 Practice Tasks for Each Topic

### 1. Fetching Data from APIs – 10 Tasks

1. Fetch and display list of users from JSONPlaceholder.

2. Fetch posts and show titles.

3. Fetch single todo by ID.

4. Use axios to fetch GitHub user profile.

5. Fetch random dog image from https://dog.ceo/api/breeds/image/random

6. Fetch country info from restcountries.com

7. Fetch current Bitcoin price from coingecko API.

8. Fetch news headlines from newsapi.org

9. Fetch Pokémon data by name.

10. Fetch dad jokes from icanhazdadjoke.com

### 2. Handling Loading States and Errors – 10 Tasks

1. Show spinner during loading.

2. Display custom error message on failed fetch.

3. Add retry button on error.

4. Show skeleton loader for list items.

5. Disable search button while loading.

6. Show "No results found" when data is empty.

7. Handle network timeout gracefully.

8. Show success toast after fetch.

9. Implement pull-to-refresh simulation.

10. Add loading overlay with dimmed background.

Master API integration to build real-world dynamic applications! 🌐