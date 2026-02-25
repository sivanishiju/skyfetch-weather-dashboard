// Replace with your actual OpenWeatherMap API key
const API_KEY = "YOUR_API_KEY_HERE";

// Change city name if you want to test other cities
const city = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

axios
  .get(url)
  .then((response) => {
    console.log(response.data);
    displayWeather(response.data);
  })
  .catch((error) => {
    console.error("Error fetching weather data:", error);
  });

function displayWeather(data) {
  const cityName = data.name;
  const temperature = data.main.temp;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  document.getElementById("city").innerText = cityName;
  document.getElementById("temperature").innerText = `${temperature}°C`;
  document.getElementById("description").innerText = description;
  document.getElementById(
    "icon"
  ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}