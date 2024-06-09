document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
        addToHistory(city);
    }
});

document.getElementById('history-list').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getWeather(city);
    }
});

function getWeather(city) {
    const apiKey = 'a0b945f7e6c681a6ecc59cca09d61668'; // Replace with your OpenWeatherMap API key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateCurrentWeather(data);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching current weather data:', error));

    // Fetch forecast weather
    fetch(forecastWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                updateForecastWeather(data);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching forecast weather data:', error));
}

function updateCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleDateString();
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.style.display = 'block';  // Show the icon
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

function updateForecastWeather(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temp = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <p>${date}</p>
            <img src="${icon}" alt="Weather Icon">
            <p>${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windSpeed} m/s</p>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistory();
    }
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear previous history
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    history.forEach(city => {
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyList.appendChild(historyItem);
    });
}

// Initialize search history on page load
document.addEventListener('DOMContentLoaded', updateHistory);
