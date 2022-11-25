
// checks users current location
let getLocation = () => {
  if (navigator.geolocation) {
    // if users location is enabled, run currentLocationWeather
    navigator.geolocation.getCurrentPosition(currentLocationWeather);
  } else {
    $("#locationWeather").text(`Turn on location to get weather near you.`);
  }
}

// displays current weather for current location
let currentLocationWeather = (position) => {

  // ---------- Current Location current weather ----------
  // Using lon/lat coordinates, fetch the current weather data for given location
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
  .then(function(response) {
  return response.json();
  })
  .then(function(data) {

  // Display the current weather for the users current location onto page
  $("#locationWeather").text(`Current weather for ${data.name}:`);
  $("#displayTemp").text(`Temperature: ${data.main.temp} °C`);
  $("#displayWind").text(`Wind: ${data.wind.speed} km/h`);
  $("#displayHumidity").text(`Humidity: ${data.main.humidity} %`);
  });

  // ---------- Current location 5 day forecast ----------
  // Fetch the 5 day forecast data for the users current location
  fetch(`https//api.openweathermap.org/data/2.5/forecast?cnt=5&lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Display the 5 day forecast for the users current location onto the page
    for (let i=0; i < data.list.length; i++) {
      $(`#cardTemp${i.toString()}`).text(`Temperature: ${data.list[i].main.temp} °C`);
      $(`#cardWind${i.toString()}`).text(`Wind: ${data.list[i].wind.speed} °C`);
      $(`#cardHumid${i.toString()}`).text(`Humidity: ${data.list[i].main.humidity} °C`);
    }
  })
}


let searchCity = () => {
  // set cityName to what the user submitted
  let cityName = ($("#search").val()).toString();
  
  // reset the textfield after submission
  $("#search").val('');

  // let openweather api decide if the users searched city is valid
  fetch(`https://api.openweathermap.org/data/2.5/forecast?cnt=5&q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
  .then(function(response) {
  if (response.ok) {
    // console.log("response is ok");
    return response.json();
  } else {
    alert("That city doesn't exist. Please try again")
  }
  })
  .then(function(data) {
    console.log(data)

    // Display the current weather for the searched city to the page
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      $("#locationWeather").text(`Current weather for ${data.name}:`);
      $("#displayTemp").text(`Temperature: ${data.main.temp} °C`);
      $("#displayWind").text(`Wind: ${data.wind.speed} km/h`);
      $("#displayHumidity").text(`Humidity: ${data.main.humidity} %`);
    })

    // Display the 5 day forecast for the searched city to the page
    for (let i=0; i < data.list.length; i++) {
      $(`#cardTemp${i.toString()}`).text(`Temperature: ${data.list[i].main.temp} °C`);
      $(`#cardWind${i.toString()}`).text(`Wind: ${data.list[i].wind.speed} °C`);
      $(`#cardHumid${i.toString()}`).text(`Humidity: ${data.list[i].main.humidity} °C`);
    }
    })
}

$("#searchCity").on("click", searchCity);

// call function right away to find users location
getLocation()



