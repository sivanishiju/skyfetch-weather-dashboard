const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const errorDiv = document.getElementById("error");

/* Fetch weather using async/await */
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  showLoading();
  errorDiv.textContent = "";
  searchBtn.disabled = true;

  try {
    const response = await axios.get(url);
    displayWeather(response.data);
  } catch (error) {
    showError("City not found. Please try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

/* Display Weather */
function displayWeather(data) {
  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    <p>${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
  `;
}

/* Error UI */
function showError(message) {
  weatherDiv.innerHTML = "";
  errorDiv.textContent = message;
}

/* Loading UI */
function showLoading() {
  weatherDiv.innerHTML = `<div class="loader"></div>`;
}

/* Search Button */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  getWeather(city);
  cityInput.value = "";
});

/* Enter Key Support */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* Initial Load */
weatherDiv.innerHTML = "<p>Search for a city to see the weather 🌍</p>";