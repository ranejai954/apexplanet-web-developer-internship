// ============================================
// WEATHER APP - OpenWeatherMap API
// ============================================

// 🔑 Get API key from config.js
const API_KEY = window.CONFIG?.WEATHER_API_KEY || '';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
let currentUnit = 'metric';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// ===== DOM Elements =====
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastDisplay = document.getElementById('forecastDisplay');
const errorMessage = document.getElementById('errorMessage');
const recentSearchesDiv = document.getElementById('recentSearches');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');

// ===== Check if API Key is Set =====
if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    console.warn('⚠️ Weather API key not configured!');
    weatherDisplay.innerHTML = `
        <div class="api-missing">
            <h3><i class="fas fa-key"></i> API Key Required</h3>
            <p>Please add your OpenWeatherMap API key to <code>js/config.js</code></p>
            <p style="margin-top:10px;">
                Get a free key at: 
                <a href="https://openweathermap.org/api" target="_blank">
                    openweathermap.org/api
                </a>
            </p>
            <p style="margin-top:10px;font-size:0.9rem;color:#991b1b;">
                ⏰ Keys take 2-3 hours to activate after signup
            </p>
        </div>
    `;
} else {
    console.log('✅ Weather API key loaded!');
}

// ===== Event Listeners =====
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        addRecentSearch(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

geoBtn.addEventListener('click', getLocationWeather);

celsiusBtn.addEventListener('click', () => {
    currentUnit = 'metric';
    celsiusBtn.className = 'btn btn-active';
    fahrenheitBtn.className = 'btn btn-inactive';
    if (cityInput.value.trim()) {
        getWeather(cityInput.value.trim());
    }
});

fahrenheitBtn.addEventListener('click', () => {
    currentUnit = 'imperial';
    fahrenheitBtn.className = 'btn btn-active';
    celsiusBtn.className = 'btn btn-inactive';
    if (cityInput.value.trim()) {
        getWeather(cityInput.value.trim());
    }
});

// ===== Get Weather by City =====
async function getWeather(city) {
    // Check if API key is set
    if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
        showError('⚠️ API key not configured. Please add your key to js/config.js');
        return;
    }

    showLoading();
    hideError();

    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your key (may take 2-3 hours to activate).');
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        }

        const data = await response.json();
        displayWeather(data);

        // Get 5-day forecast
        await getForecast(city);

    } catch (error) {
        showError(error.message);
        weatherDisplay.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-circle" style="color:#dc2626;"></i>
                <p style="color:#dc2626;">${error.message}</p>
            </div>
        `;
        forecastDisplay.innerHTML = '';
    }
}

// ===== Get 5-Day Forecast =====
async function getForecast(city) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to get forecast');

        const data = await response.json();
        displayForecast(data);

    } catch (error) {
        console.error('Forecast error:', error);
        forecastDisplay.innerHTML = `
            <p style="color:#64748b;text-align:center;padding:20px;">
                <i class="fas fa-exclamation-circle"></i> Could not load forecast.
            </p>
        `;
    }
}

// ===== Get Weather by Geolocation =====
function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showLoading();
    hideError();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(
                    `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${API_KEY}`
                );
                
                if (!response.ok) throw new Error('Failed to get weather for your location');
                
                const data = await response.json();
                displayWeather(data);
                cityInput.value = data.name;
                addRecentSearch(data.name);
                await getForecast(data.name);
            } catch (error) {
                showError('Failed to get weather for your location.');
            }
        },
        () => {
            showError('Unable to access your location. Please allow location access.');
        }
    );
}

// ===== Display Weather =====
function displayWeather(data) {
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-card">
            <div class="weather-main">
                <div class="weather-temp">
                    <div>
                        <span class="city-name">${data.name}</span>
                        <span class="city-country">, ${data.sys.country}</span>
                    </div>
                    <h1>${Math.round(data.main.temp)}${tempUnit}</h1>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="${iconUrl}" alt="${data.weather[0].description}">
                </div>
            </div>
            <div class="weather-details">
                <div class="detail">
                    <i class="fas fa-temperature-high"></i>
                    <span>Feels Like: ${Math.round(data.main.feels_like)}${tempUnit}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-droplet"></i>
                    <span>Humidity: ${data.main.humidity}%</span>
                </div>
                <div class="detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${data.wind.speed} ${speedUnit}</span>
                </div>
                <div class="detail">
                    <i class="fas fa-gauge-high"></i>
                    <span>Pressure: ${data.main.pressure} hPa</span>
                </div>
            </div>
        </div>
    `;
}

// ===== Display 5-Day Forecast =====
function displayForecast(data) {
    // Get one forecast per day (every 8th item = 24 hours)
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';

    if (dailyForecasts.length === 0) {
        forecastDisplay.innerHTML = '';
        return;
    }

    forecastDisplay.innerHTML = `
        <div class="forecast-section">
            <h3><i class="fas fa-calendar-day"></i> 5-Day Forecast</h3>
            <div class="forecast-grid">
                ${dailyForecasts.map(day => {
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                    return `
                        <div class="forecast-card">
                            <p class="day">${dayName}</p>
                            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" 
                                 alt="${day.weather[0].description}">
                            <p class="forecast-temp">${Math.round(day.main.temp)}${tempUnit}</p>
                            <p style="font-size:0.75rem;color:#94a3b8;text-transform:capitalize;">
                                ${day.weather[0].description}
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ===== Recent Searches =====
function addRecentSearch(city) {
    // Remove if already exists (case insensitive)
    recentSearches = recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase());
    recentSearches.unshift(city);
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

function displayRecentSearches() {
    if (recentSearches.length === 0) {
        recentSearchesDiv.innerHTML = '';
        return;
    }

    recentSearchesDiv.innerHTML = `
        <p><i class="fas fa-clock-rotate-left"></i> Recent Searches:</p>
        <div class="recent-tags">
            ${recentSearches.map(city => `
                <span class="recent-tag" onclick="getWeather('${city}')">
                    ${city}
                </span>
            `).join('')}
        </div>
    `;
}

// ===== UI Helpers =====
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Loading weather data...</p>
        </div>
    `;
    forecastDisplay.innerHTML = '';
}

function showError(message) {
    errorMessage.textContent = '⚠️ ' + message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 6000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

// ===== Initialize =====
displayRecentSearches();

// Load default city on startup (if API key is set)
if (API_KEY && API_KEY !== 'your_openweathermap_api_key_here') {
    getWeather('London');
}
