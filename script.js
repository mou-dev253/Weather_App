function getWeather() {
  const rawCity = document.getElementById("cityInput").value.trim();
  const weatherBox = document.getElementById("weatherResult");

  if (!rawCity) {
    showError("⚠️ Please enter a city name");
    return;
  }

  const city = encodeURIComponent(rawCity);
  const apiKey = "MY_API_KEY_HERE";// For security, the live API key is not included in the public repo, but the code works when tested locally.
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  weatherBox.innerHTML = `<p>Loading weather data...</p>`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        if (res.status === 404) throw new Error("❌ City not found");
        if (res.status === 401) throw new Error("❌ Invalid or inactive API key");
        throw new Error("❌ Network / API error");
      }
      return res.json();
    })
    .then(data => showWeather(data))
    .catch(err => showError(err.message));
}

function showWeather(data) {
  const { name, main, weather, wind, sys, visibility, dt, timezone } = data;

  // Convert Unix time + timezone to local date string
  const localDate = new Date((dt + timezone) * 1000).toUTCString().replace("GMT", "local time");

  document.getElementById("weatherResult").innerHTML = `
    <h2>${name}, ${sys.country}</h2>
    <p class="desc">${weather[0].description.toUpperCase()}</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather icon">
    <p><strong>Temperature:</strong> ${main.temp} °C</p>
    <p><strong>Feels Like:</strong> ${main.feels_like} °C</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    <p><strong>Visibility:</strong> ${visibility / 1000} km</p>
    <p><strong>Local Time:</strong> ${localDate}</p>
  `;
}

function showError(msg) {
  document.getElementById("weatherResult").innerHTML = `<p class="error">${msg}</p>`;
}
