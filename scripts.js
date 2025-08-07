// Header Component
const Header = {
  init: function() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
};

// Location Input Component
const LocationInput = {
  init: function(callback) {
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-input');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const loc = input.value.trim();
      if (loc) {
        callback(loc);
      }
    });
  }
};

// Current Weather Display Component
const CurrentWeatherDisplay = {
  elements: {
    location: document.getElementById('weather-location'),
    description: document.getElementById('weather-description'),
    icon: document.getElementById('weather-icon'),
    temp: document.getElementById('temp'),
    wind: document.getElementById('wind'),
    humidity: document.getElementById('humidity'),
    loader: document.getElementById('weather-loader'),
    content: document.getElementById('weather-content')
  },
  
  showLoading: function() {
    this.elements.loader.classList.remove('hidden');
    this.elements.content.style.display = 'none';
  },
  
  hideLoading: function() {
    this.elements.loader.classList.add('hidden');
    this.elements.content.style.display = 'block';
  },
  
  update: function(data) {
    this.elements.location.textContent = `${data.name}, ${data.sys.country}`;
    this.elements.description.textContent = data.weather[0].description.toUpperCase();
    this.elements.icon.src = WeatherAPI.getIconUrl(data.weather[0].icon);
    this.elements.icon.alt = `Weather icon showing ${data.weather[0].description}`;
    this.elements.temp.textContent = `${WeatherUtils.fToC(data.main.temp)}°C`;
    this.elements.wind.textContent = `${WeatherUtils.mphToMs(data.wind.speed)} m/s`;
    this.elements.humidity.textContent = `${data.main.humidity}%`;
    WeatherUtils.animateIcon(this.elements.icon);
  },
  
  showError: function(msg) {
    this.elements.location.textContent = msg;
    this.elements.description.textContent = '';
    this.elements.icon.src = 'https://placehold.co/150x150/png?text=!';
    this.elements.icon.alt = 'Error icon';
    this.elements.temp.textContent = '--°C';
    this.elements.wind.textContent = '-- m/s';
    this.elements.humidity.textContent = '--%';
  }
};

// Current Weather Card Component
const CurrentWeatherCard = {
  elements: {
    icon: document.getElementById('current-icon'),
    location: document.getElementById('current-location'),
    weatherMain: document.getElementById('current-weather-main'),
    weatherDesc: document.getElementById('current-weather-desc'),
    temp: document.getElementById('current-temp'),
    wind: document.getElementById('current-wind'),
    humidity: document.getElementById('current-humidity')
  },
  
  update: function(data) {
    this.elements.location.textContent = `${data.name}, ${data.sys.country}`;
    this.elements.weatherMain.textContent = data.weather[0].main.toUpperCase();
    this.elements.weatherDesc.textContent = data.weather[0].description.toUpperCase();
    this.elements.icon.src = WeatherAPI.getIconUrl(data.weather[0].icon);
    this.elements.icon.alt = `Weather icon showing ${data.weather[0].description}`;
    this.elements.temp.textContent = `${WeatherUtils.fToC(data.main.temp)}°C`;
    this.elements.wind.textContent = `${WeatherUtils.mphToMs(data.wind.speed)} m/s`;
    this.elements.humidity.textContent = `${data.main.humidity}%`;
    WeatherUtils.animateIcon(this.elements.icon);
  },
  
  showError: function(msg) {
    this.elements.location.textContent = msg;
    this.elements.weatherMain.textContent = '--';
    this.elements.weatherDesc.textContent = '--';
    this.elements.icon.src = 'https://placehold.co/150x150/png?text=!';
    this.elements.icon.alt = 'Error icon';
    this.elements.temp.textContent = '--°C';
    this.elements.wind.textContent = '-- m/s';
    this.elements.humidity.textContent = '--%';
  }
};

// 48 Hour Forecast Component
const HourlyForecast = {
  elements: {
    container: document.getElementById('hourly-forecast'),
    emptyMsg: document.getElementById('hourly-empty-msg')
  },
  
  update: function(hourly, timezoneOffset) {
    this.elements.emptyMsg.style.display = 'none';
    this.elements.container.innerHTML = '';
    
    hourly.slice(0, 48).forEach(hour => {
      const time = WeatherUtils.formatTime(hour.dt, timezoneOffset);
      const tempC = WeatherUtils.fToC(hour.temp);
      const iconUrl = WeatherAPI.getIconUrl(hour.weather[0].icon);
      const desc = hour.weather[0].description;
      const windMs = WeatherUtils.mphToMs(hour.wind_speed);
      
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center border-b border-pink-700 pb-2 text-pink-400';
      item.innerHTML = `
        <span class="font-bold">${time}</span>
        <span class="flex items-center space-x-2">
          <img src="${iconUrl}" alt="${desc}" class="w-6 h-6"/>
          <span>${desc.charAt(0).toUpperCase() + desc.slice(1)}</span>
        </span>
        <span>${tempC}°C</span>
        <span><i class="fas fa-wind"></i> ${windMs} m/s</span>
      `;
      
      this.elements.container.appendChild(item);
    });
  },
  
  showError: function(msg) {
    this.elements.container.innerHTML = '';
    this.elements.emptyMsg.style.display = 'block';
    this.elements.emptyMsg.textContent = msg;
  },
  
  setLoading: function() {
    this.elements.container.innerHTML = '';
    this.elements.emptyMsg.style.display = 'block';
    this.elements.emptyMsg.textContent = 'Loading forecast...';
  }
};

// Weather Anomaly Detector Component
const AnomalyDetector = {
  elements: {
    msg: document.getElementById('anomaly-msg'),
    list: document.getElementById('anomaly-list'),
    alertBtn: document.getElementById('anomaly-alert-btn')
  },
  
  update: function(anomalies) {
    this.elements.list.innerHTML = '';
    
    if (anomalies.length === 0) {
      this.elements.msg.textContent = 'No significant weather anomalies detected for this location.';
      this.elements.alertBtn.disabled = true;
    } else {
      this.elements.msg.textContent = 'Detected weather anomalies:';
      anomalies.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        this.elements.list.appendChild(li);
      });
      this.elements.alertBtn.disabled = false;
    }
  },
  
  setLoading: function() {
    this.elements.msg.textContent = 'Loading anomaly data...';
    this.elements.list.innerHTML = '';
    this.elements.alertBtn.disabled = true;
  },
  
  showError: function(msg) {
    this.elements.msg.textContent = msg;
    this.elements.list.innerHTML = '';
    this.elements.alertBtn.disabled = true;
  }
};

// Footer Component
const Footer = {
  element: document.getElementById('footer-info'),
  
  update: function(text) {
    this.element.textContent = text;
  }
};





// Main App Controller
const WeatherApp = {
  init: async function() {
    // Initialize components
    Header.init();
    LocationInput.init(this.updateWeatherForLocation.bind(this));
    
    // Initialize icon animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flicker {
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px #00ffe0); }
        50% { opacity: 0.7; filter: drop-shadow(0 0 20px #ff00c8); }
      }
      .animate-flicker {
        animation: flicker 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    // Load initial weather
    try {
      const pos = await WeatherUtils.getUserLocation();
      const city = await WeatherAPI.reverseGeocode(pos.lat, pos.lon);
      document.getElementById('location-input').value = city;
      await this.updateWeatherForLocation(city);
    } catch (error) {
      console.error('Initialization error:', error);
      const fallbackCity = 'New York';
      document.getElementById('location-input').value = '';
      CurrentWeatherDisplay.elements.location.textContent = 'Unable to get your location. Showing default city weather.';
      Footer.update(`Geolocation error: ${error.message}. Showing weather for ${fallbackCity}.`);
      await this.updateWeatherForLocation(fallbackCity);
    }
  },
  
  updateWeatherForLocation: async function(location) {
    // Show loading states
    CurrentWeatherDisplay.showLoading();
    AnomalyDetector.setLoading();
    HourlyForecast.setLoading();
    
    try {
      // Fetch current weather by city
      const currentWeather = await WeatherAPI.fetchWeatherByCity(location);
      
      // Update UI components
      CurrentWeatherDisplay.update(currentWeather);
      CurrentWeatherCard.update(currentWeather);
      
      // Fetch hourly forecast by coordinates
      try {
        const hourlyData = await WeatherAPI.fetchHourlyForecast(
          currentWeather.coord.lat, 
          currentWeather.coord.lon
        );
        
        // Check if we have hourly data
        if (hourlyData.hourly && hourlyData.hourly.length > 0) {
          HourlyForecast.update(hourlyData.hourly, hourlyData.timezone_offset || 0);
        } else {
          HourlyForecast.showError('No hourly forecast data available for this location.');
        }
      } catch (err) {
        console.error('Hourly forecast error:', err);
        HourlyForecast.showError('Failed to load hourly forecast. Please try again later.');
      }
      
      // Detect and display anomalies
      const anomalies = WeatherUtils.detectAnomalies(currentWeather);
      AnomalyDetector.update(anomalies);
      
      // Update footer
      Footer.update(`Showing live weather for "${currentWeather.name}, ${currentWeather.sys.country}". API: OpenWeatherMap.`);
      
    } catch (error) {
      console.error('Weather update error:', error);
      
      // Show errors in all components
      CurrentWeatherDisplay.showError(error.message);
      CurrentWeatherCard.showError(error.message);
      HourlyForecast.showError('No forecast data available for this location.');
      AnomalyDetector.showError('No anomaly data available.');
      Footer.update(`Error: ${error.message}. API: OpenWeatherMap.`);
    } finally {
      CurrentWeatherDisplay.hideLoading();
    }
  }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  WeatherApp.init();
});


// Weather API Service
const WeatherAPI = {
  // Replace with your actual OpenWeatherMap API key
  API_KEY: 'YOUR_API_KEY_HERE',
  
  getIconUrl: function(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  },
  
  fetchWeatherByCity: async function(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Invalid API key. Please get a new API key from OpenWeatherMap.');
      if (response.status === 404) throw new Error('Location not found');
      throw new Error('API error');
    }
    
    return response.json();
  },
  
  fetchHourlyForecast: async function(lat, lon) {
    // Try the new 3.0 API first
    let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this.API_KEY}&units=imperial`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (e) {
      console.log('3.0 API failed, trying 2.5');
    }
    
    // Fallback to 2.5 API
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Hourly forecast API error');
    }
    
    return response.json();
  },
  
  fetchWeatherByCoords: async function(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API error fetching weather by coordinates');
    return response.json();
  },
  
  reverseGeocode: async function(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API error reverse geocoding');
    const data = await response.json();
    
    if (data.length === 0) throw new Error('No location found for coordinates');
    return data[0].name;
  }
};


// Weather Utilities
const WeatherUtils = {
  // Convert Fahrenheit to Celsius
  fToC: function(f) {
    return Math.round((f - 32) * 5 / 9);
  },
  
  // Convert miles per hour to meters per second
  mphToMs: function(mph) {
    return (mph * 0.44704).toFixed(1);
  },
  
  // Format timestamp to local time string
  formatTime: function(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
  
  // Animate weather icon with subtle neon flicker
  animateIcon: function(iconEl) {
    iconEl.classList.add('animate-flicker');
    setTimeout(() => {
      iconEl.classList.remove('animate-flicker');
    }, 2000);
  },
  
  // Detect weather anomalies
  detectAnomalies: function(weatherData) {
    const anomalies = [];
    const main = weatherData.weather[0].main.toLowerCase();
    const desc = weatherData.weather[0].description.toLowerCase();
    const windSpeed = weatherData.wind.speed;
    const temp = weatherData.main.temp;
    
    if (main.includes('thunderstorm')) anomalies.push('⚡ Intense Thunderstorms detected');
    if (main.includes('tornado') || desc.includes('tornado')) anomalies.push('🌪️ Tornado conditions detected');
    if (windSpeed > 50) anomalies.push(`💨 Extreme winds at ${Math.round(windSpeed)} mph`);
    if (temp > 100) anomalies.push(`🔥 Scorching heat at ${Math.round(temp)}°F`);
    if (main.includes('snow')) anomalies.push('❄️ Heavy Snowfall detected');
    if (main.includes('rain') && windSpeed > 40) anomalies.push('🌧️ Heavy rain with strong winds');
    if (desc.includes('acid rain')) anomalies.push('☠️ Toxic Acid Rain warning');
    if (desc.includes('firestorm') || desc.includes('wildfire')) anomalies.push('🔥 Firestorm alert');
    if (desc.includes('fog') && windSpeed < 5) anomalies.push('🌫️ Dense toxic fog detected');
    
    return anomalies;
  },
  
  // Get user's current location via Geolocation API
  getUserLocation: function() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      } else {
        navigator.geolocation.getCurrentPosition(
          pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          err => reject(err)
        );
      }
    });
  }
};

// Weather API Service
const WeatherAPI = {
  // Replace with your actual OpenWeatherMap API key
  API_KEY: 'YOUR_API_KEY_HERE',
  
  getIconUrl: function(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  },
  
  fetchWeatherByCity: async function(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Invalid API key. Please get a new API key from OpenWeatherMap.');
      if (response.status === 404) throw new Error('Location not found');
      throw new Error('API error');
    }
    
    return response.json();
  },
  
  fetchHourlyForecast: async function(lat, lon) {
    // Try the new 3.0 API first
    let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this.API_KEY}&units=imperial`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (e) {
      console.log('3.0 API failed, trying 2.5');
    }
    
    // Fallback to 2.5 API
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Hourly forecast API error');
    }
    
    return response.json();
  },
  
  fetchWeatherByCoords: async function(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=imperial`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API error fetching weather by coordinates');
    return response.json();
  },
  
  reverseGeocode: async function(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API error reverse geocoding');
    const data = await response.json();
    
    if (data.length === 0) throw new Error('No location found for coordinates');
    return data[0].name;
  }
};