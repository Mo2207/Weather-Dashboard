
// Todays date
let currentDate = dayjs().format("D/MM/YYYY");

// Checks users current location
let getLocation = () => {
  if (navigator.geolocation) {
    // if users location is enabled, call currentLocationWeather
    navigator.geolocation.getCurrentPosition(currentLocationWeather);
  } else {
    // if location can't be found
    $("#locationWeather").text(`Turn on location to get weather near you.`);
  }
}

// Displays current weather for current location and the 5 day forecast as soon as page is loaded
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

      // If cityName is accepted, fetch again
      fetch(`https://api.openweathermap.org/data/2.5/forecast?cnt=5&q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
      .then(function(reponse) {
        
        // Call searchHistory with the cityName to add it to recently searched list
        searchHistory(cityName);

        return response.json();
      })
      .then(function(data) {
        // Fetch weather for searched city
        fetchCurrentWeather(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
    
        fetchFutureForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=45&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
      })
    } 
    else {
      // Alert error to the user if their searched city wasn't accepted by api
      alert("That city doesn't exist. Please try again");
    }
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

// Validates searched city first, then displays the current and 5 day forecast for the searched city
let searchHistory = (cityName) => {
  cityName = cityName.toUpperCase();

  let history = $("#history").append($(`<button>${cityName}</button`).addClass("historyBtn btn btn-outline-secondary mt-2 w-100"));
  
}

$("#searchCity").on("click", searchCity);
$(".historyBtn").on("click", function() {
  console.log("Hello")
})

// call function right away to find users location
getLocation()



