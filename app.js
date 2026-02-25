function WeatherApp() {
  this.apiKey = "YOUR_API_KEY_HERE";
  this.baseUrl = "https://api.openweathermap.org/data/2.5/weather";
  this.recentSearches = [];
}

WeatherApp.prototype.init = function () {
  document
    .getElementById("searchBtn")
    .addEventListener("click", () => {
      const city = document.getElementById("cityInput").value.trim();
      if (city) this.getWeather(city);
    });

  document
    .getElementById("clearHistory")
    .addEventListener("click", this.clearHistory.bind(this));

  this.loadRecentSearches();
  this.loadLastCity();
};

WeatherApp.prototype.getWeather = function (city) {
  const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

  axios
    .get(url)
    .then((response) => {
      this.displayWeather(response.data);
      this.saveRecentSearch(city);
      localStorage.setItem("lastCity", city);
    })
    .catch(() => {
      document.getElementById("weather").innerHTML =
        "<p>❌ City not found</p>";
    });
};

WeatherApp.prototype.displayWeather = function (data) {
  const weatherDiv = document.getElementById("weather");

  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <h3>${Math.round(data.main.temp)}°C</h3>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  `;
};

WeatherApp.prototype.loadRecentSearches = function () {
  const stored = localStorage.getItem("recentSearches");
  this.recentSearches = stored ? JSON.parse(stored) : [];
  this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(
    (c) => c !== city
  );

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  const container = document.getElementById("recentButtons");
  container.innerHTML = "";

  this.recentSearches.forEach(
    function (city) {
      const btn = document.createElement("button");
      btn.className = "recent-btn";
      btn.textContent = city;
      btn.addEventListener("click", () => {
        this.getWeather(city);
      });
      container.appendChild(btn);
    }.bind(this)
  );
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");
  this.recentSearches = [];
  this.displayRecentSearches();
  document.getElementById("weather").innerHTML =
    "<p class='welcome'>History cleared 🌱</p>";
};

const app = new WeatherApp();
app.init();