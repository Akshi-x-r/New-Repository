const apiKey = 'YOUR_API_KEY'; // Replace with your BrightSky API key
const apiUrl = 'https://api.brightsky.dev';

document.getElementById('location-btn').addEventListener('click', getLocation);
document.getElementById('search-btn').addEventListener('click', searchCity);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherData(lat, lon);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function searchCity() {
  const city = document.getElementById('city-input').value;
  if (city) {
    fetch(`${apiUrl}/weather?city=${city}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        displayWeatherData(data);
      });
  }
}

function getWeatherData(lat, lon) {
  fetch(`${apiUrl}/weather?lat=${lat}&lon=${lon}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function displayWeatherData(data) {
  const cityName = data.city.name;
  const temp = data.current.temp;
  const windSpeed = data.current.wind_speed;
  const precipitation = data.current.precipitation;
  const description = data.current.weather[0].description;
  
  document.getElementById('city-name').textContent = cityName;
  document.getElementById('current-temp').textContent = `Temp: ${temp}°C`;
  document.getElementById('current-wind').textContent = `Wind: ${windSpeed} km/h`;
  document.getElementById('current-precip').textContent = `Precipitation: ${precipitation}%`;
  document.getElementById('current-description').textContent = `Condition: ${description}`;

  displayHourlyForecast(data.hourly);
  displayWeeklyForecast(data.daily);
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecast = document.getElementById('hourly-forecast');
  hourlyForecast.innerHTML = ''; // Clear previous data

  hourlyData.slice(0, 6).forEach(hour => {
    const hourCard = document.createElement('div');
    hourCard.classList.add('forecast-card');
    hourCard.innerHTML = `
      <p>${new Date(hour.dt * 1000).getHours()}:00</p>
      <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" alt="${hour.weather[0].description}">
      <p>${hour.temp}°C</p>
    `;
    hourlyForecast.appendChild(hourCard);
  });
}

function displayWeeklyForecast(dailyData) {
  const weeklyForecast = document.getElementById('weekly-forecast');
  weeklyForecast.innerHTML = ''; // Clear previous data

  dailyData.slice(0, 7).forEach(day => {
    const dayCard = document.createElement('div');
    dayCard.classList.add('forecast-card');
    dayCard.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      <p>${day.temp.day}°C / ${day.temp.night}°C</p>
    `;
    weeklyForecast.appendChild(dayCard);
  });
}



