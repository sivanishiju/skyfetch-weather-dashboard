const API_KEY = "YOUR_API_KEY_HERE";

/* Constructor */
function WeatherApp() {
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.weatherDiv = document.getElementById("weather");
  this.forecastDiv = document.getElementById("forecast");
  this.errorDiv = document.getElementById("error");
}

/* Init */
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.searchBtn.click();
  });

  this.showWelcome();
};

/* Welcome */
WeatherApp.prototype.showWelcome = function () {
  this.weatherDiv.innerHTML =
    "<p>Search for a city to see weather 🌍</p>";
  this.forecastDiv.innerHTML = "";
};

/* Handle Search */
WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();
  if (!city) {
    this.showError("Please enter a city name.");
    return;
  }
  this.getWeather(city);
  this.cityInput.value = "";
};

/* Fetch Weather + Forecast */
WeatherApp.prototype.getWeather = async function (city) {
  const weatherURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  this.showLoading();
  this.errorDiv.textContent = "";
  this.searchBtn.disabled = true;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherURL),
      axios.get(forecastURL),
    ]);

    this.displayWeather(weatherRes.data);
    const forecastData =
      this.processForecastData(forecastRes.data.list);
    this.displayForecast(forecastData);
  } catch (error) {
    this.showError("City not found. Please try again.");
  } finally {
    this.searchBtn.disabled = false;
  }
};

/* Display Current Weather */
WeatherApp.prototype.displayWeather = function (data) {
  this.weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p>${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
  `;
};

/* Process Forecast */
WeatherApp.prototype.processForecastData = function (list) {
  return list.filter(item =>
    item.dt_txt.includes("12:00:00")
  ).slice(0, 5);
};

/* Display Forecast */
WeatherApp.prototype.displayForecast = function (forecast) {
  this.forecastDiv.innerHTML = "";
  forecast.forEach(item => {
    const day = new Date(item.dt_txt)
      .toLocaleDateString("en-US", { weekday: "short" });

    this.forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${day}</h4>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
        <p>${item.main.temp}°C</p>
        <p>${item.weather[0].description}</p>
      </div>
    `;
  });
};

/* Loading */
WeatherApp.prototype.showLoading = function () {
  this.weatherDiv.innerHTML = `<div class="loader"></div>`;
  this.forecastDiv.innerHTML = "";
};

/* Error */
WeatherApp.prototype.showError = function (message) {
  this.weatherDiv.innerHTML = "";
  this.forecastDiv.innerHTML = "";
  this.errorDiv.textContent = message;
};

/* Create Instance */
const app = new WeatherApp();
app.init();