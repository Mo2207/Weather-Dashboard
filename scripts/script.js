
let currentDate = dayjs().format("D/MM/YYYY");

// checks users current location
let getLocation = () => {
  if (navigator.geolocation) {
    // if users location is enabled, run currentLocationWeather
    navigator.geolocation.getCurrentPosition(currentLocationWeather);
  } else {
    // if location can't be found
    $("#locationWeather").text(`Turn on location to get weather near you.`);
  }
}

// displays current weather for current location and the 5 day forecast as soon as page is loaded
let currentLocationWeather = (position) => {
  fetchCurrentWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);

  fetchFutureForecast(`https://api.openweathermap.org/data/2.5/forecast?cnt=45&lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
}

// searchCity is called when user submits a city name
let searchCity = () => {

  // set cityName to what the user submitted
  let cityName = ($("#search").val()).toString();
  // reset the textfield after submission
  $("#search").val('');

  // Let openWeather API decide if the users searched city is valid
  fetch(`https://api.openweathermap.org/data/2.5/forecast?cnt=5&q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
    alert("That city doesn't exist. Please try again")
    }
  })
  .then(function(data) {

    // Once validated, fetch the current and the 5 day forecast
    fetchCurrentWeather(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
    
    fetchFutureForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=45&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
  })
}

// Fetches the current weather data
let fetchCurrentWeather = (url) => {
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    $("#locationWeather").text(`Current weather for ${data.name} (${currentDate})`);
    $("#displayTemp").text(`Temperature: ${data.main.temp} °C`);
    $("#displayWind").text(`Wind: ${data.wind.speed} km/h`);
    $("#displayHumidity").text(`Humidity: ${data.main.humidity} %`);
  })
}

// Fetches the 5 day forecast
let fetchFutureForecast = (url) => {
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let cardCount = 1;
    for (let i=5; i < data.list.length; i+=8) {
      $(`#cardDate${cardCount.toString()}`).text(`${data.list[i].dt_txt.slice(0,-9)}`);
      $(`#cardTemp${cardCount.toString()}`).text(`Temperature: ${data.list[i].main.temp} °C`);
      $(`#cardWind${cardCount.toString()}`).text(`Wind: ${data.list[i].wind.speed} km/h`);
      $(`#cardHumid${cardCount.toString()}`).text(`Humidity: ${data.list[i].main.humidity} %`);
      cardCount++;
    }
  })
}

let searchHistory = () => {

  // set cityName to what the user submitted
  let cityName = ($("#search").val()).toString();

  let history = $("#history").addClass("badge text-bg-secondary w-100").css("height: 4vh;");
  
}

$("#searchCity").on("click", searchCity);

// call function right away to find users location
getLocation()



