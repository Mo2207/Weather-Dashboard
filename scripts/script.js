
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
    let iconCode = data.weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    $("#locationWeather").text(`Current weather for ${data.name} (${currentDate})`);
    $("#displayTemp").text(`Temperature: ${data.main.temp} °C`).append(`<img src= ${iconUrl} />`);
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
      let iconCode = data.list[i].weather[0].icon;
      let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
      
      $(`#cardDate${cardCount.toString()}`).text(`${data.list[i].dt_txt.slice(0,-9)}`);
      $(`#cardTemp${cardCount.toString()}`).text(`Temperature: ${data.list[i].main.temp} °C`).append(`<img src= ${iconUrl} />`);
      $(`#cardWind${cardCount.toString()}`).text(`Wind: ${data.list[i].wind.speed} km/h`);
      $(`#cardHumid${cardCount.toString()}`).text(`Humidity: ${data.list[i].main.humidity} %`);
      cardCount++;
    }
  })
}

// Validates searched city first, then displays the current and 5 day forecast for the searched city
let searchHistory = (cityHistory) => {
  cityHistory = cityHistory.toUpperCase();

  // Get cities stores in localStorage, if it doesn't exist yet set it to empty array
  let searchedCities = JSON.parse(localStorage.getItem("searchedCities")||"[]");
  searchedCities.push(cityHistory); 
  // Add the searchedCity to the array in localStorage
  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

  let history = $("#history").append($(`<button type="button" class="btn btn-outline-secondary mt-1 w-100">${cityHistory}</button>`));
}

// If searchedCities is empty in localStorage, wait for it to have a value first
if (JSON.parse(localStorage.getItem("searchedCities"))) {

  // When the page is refreshed, and if searchedCities has a value saved to localStorage, loop through the array and update the html to display the search history buttons
  for (let i=0; i < (JSON.parse(localStorage.getItem("searchedCities"))).length; i++) {

    let history = $("#history").append($(`<button type="button" class="btn btn-outline-secondary mt-1 w-100">${(JSON.parse(localStorage.getItem("searchedCities")))[i]}</button>`));
  }
}

// Event listener for submitted searches 
$("#searchCity").on("click", searchCity);

// Event listener for search history buttons
$("#history").on("click", function(event) {
  let current = event.target.textContent;
  
  // Recall the current/future forecast using the textContent as the value in the button pressed
  fetchCurrentWeather(`https://api.openweathermap.org/data/2.5/weather?q=${current}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`);
  fetchFutureForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${current}&cnt=45&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
})

// Call getLocation right away to find users location
getLocation()



