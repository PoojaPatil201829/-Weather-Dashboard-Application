 import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain, faSnowflake, } from '@fortawesome/free-solid-svg-icons';
import { faTint,faTintSlash,faWater} from '@fortawesome/free-solid-svg-icons';

//import './Weather.css'




const weatherIcons = {
  'Clear': faSun,
  'Clouds': faCloud,
  'Partly Cloudy': faCloudSun,
  'Rain': faCloudRain,
  'Snow': faSnowflake,
  // Add more as needed
};

const temperatureIcons = {
  'Clear': faSun,
  'Clouds': faCloud,
  'Partly Cloudy': faCloudSun,
  'Rain': faCloudRain,
  'Snow': faSnowflake,
  // Add more as needed
};

const getTemperatureIcon = (temperature) => {
  if (temperature > 30) {
    return temperatureIcons['Clear']; // Hot weather
  } else if (temperature > 20) {
    return temperatureIcons['Partly Cloudy']; // Warm weather
  } else if (temperature > 10) {
    return temperatureIcons['Clouds']; // Mild weather
  } else if (temperature > 0) {
    return temperatureIcons['Rain']; // Cool weather
  } else {
    return temperatureIcons['Snow']; // Cold weather
  }
};

const humidityIcons = {
  'Low': faTint,       // You can replace this with the appropriate icon
  'Moderate': faTintSlash,   // You can replace this with the appropriate icon
  'High': faWater,       // You can replace this with the appropriate icon
  // Add more as needed
};

const getHumidityIcon = (humidity) => {
  if (humidity < 30) {
    return humidityIcons['Low'];       // Low humidity
  } else if (humidity < 70) {
    return humidityIcons['Moderate'];  // Moderate humidity
  } else {
    return humidityIcons['High'];      // High humidity
  }
};



const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

//   const fetchData = () => {
//     axios
//       .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=bcbe639730dbb7513ce3f36afd94f914`)
//       .then(response => {
//         setWeatherData(response.data);
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//         setError('Error fetching weather data');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

const fetchData = (retryCount = 0) => {

    const apikey='084906874e7507d31a1b49bebd910038'
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`)
      .then(response => {
        setWeatherData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.status === 429 && retryCount < 3) {
          const delay = 5000; // 5 seconds delay before retrying
          setTimeout(() => {
            fetchData(retryCount + 1);
          }, delay);
        } else {
          setError('Error fetching weather data');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

//   useEffect(() => {
//     fetchData();
//   });

useEffect(() => {
    const delay = 3000; // 3 seconds delay between requests
    const timeoutId = setTimeout(() => {
      fetchData();
    }, delay);
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, [city]);
  
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetchData();
  };

  return (
    <div className='weather-container'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p className='error-message'>{error}</p>
      ) : (
        <div className='weather-info'>
          <h2>{weatherData.name}</h2>
          <p>
            <FontAwesomeIcon icon={weatherIcons[weatherData.weather[0].main]} />
            {weatherData.weather[0].description}
          </p>
          
          <p>
          <FontAwesomeIcon icon={getTemperatureIcon(weatherData.main.temp)} />
               {weatherData.main.temp}°C
    
          </p>

          {/* <p>
          <FontAwesomeIcon icon={getHumidityIcon(weatherData.main.humidity)} />
           Humidity: {weatherData.main.humidity}%
          </p> */}
          {/* <p>Description: {weatherData.weather[0].description}</p> */}
          {/* <p>Feels like: {weatherData.main.feels_like}°C</p> */}
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Pressure: {weatherData.main.pressure}</p>
          <p>Wind Speed: {weatherData.wind.speed}m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
