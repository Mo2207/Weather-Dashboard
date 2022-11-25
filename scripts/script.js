
// Fetch from the openweather api
let sjWeather;
fetch(`https://api.openweathermap.org/data/2.5/forecast?cnt=1&q=${"saint John"}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  sjWeather = data;
  $("#locationWeather").text(`Current weather for ${data.city.name}:`);
  $("#displayTemp").text(`Temperature: ${sjWeather.list[0].main.temp} °C`);
  $("#displayWind").text(`Wind: ${sjWeather.list[0].wind.speed} km/h`);
  $("#displayHumidity").text(`Humidity: ${sjWeather.list[0].main.humidity} %`);
  console.log(sjWeather);
});



let getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation);
  } else {
    console.log("Turn on location to get weather near you.");
  }
}

let showLocation = (position) => {
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)
}


let searchCity = () => {
  let cityName = ($("#search").val()).toString();
  $("#search").val('');
  console.log(cityName)

  // let openweather api decide if the users searched city is valid
  fetch(`https://api.openweathermap.org/data/2.5/forecast?cnt=1&q=${cityName}&units=metric&appid=3a3724d04775e368285b5dbd5c300e67`)
  .then(function (response) {
  if (response.ok) {
    console.log("response is ok");
    return response.json();
  } else {
    alert("That city doesn't exist. Please try again")
  }
  })
  .then(function(data) {
    $("#locationWeather").text(`Current weather for ${data.city.name}:`);
    $("#displayTemp").text(`Temperature: ${data.list[0].main.temp} °C`);
    $("#displayWind").text(`Wind: ${data.list[0].wind.speed} km/h`);
    $("#displayHumidity").text(`Humidity: ${data.list[0].main.humidity} %`);
  })
}

$("#searchCity").on("click", searchCity);


// getLocation()



