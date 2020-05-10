//SETUP KEY VARIABLES

const result = document.querySelector('#results__treker');
const printBtn = document.querySelector('#print__save');
const deleteBtn = document.querySelector('#btn__delete');
const form = document.querySelector('#form');
const leavingFrom = document.querySelector('input[name="from"]');
const goingTo = document.querySelector('input[name="to"]');
const depDate = document.querySelector('input[name="date"]');
const timestampNow = Date.now() / 1000;

//URLS & API KEY VARIABLE
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = 'jbcruz0209';
const pixabayApiURL = 'https://pixabay.com/api/?key=';
const pixabayApiKEY = '16383683-2534ceeaee7927f6d1ef0ab29';
const weatherbitApiURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitApiKEY = 'e7526e9d7e2e46c5b71b57f38a2e9f33';

// SUBMIT INPUT FOR TREKER FORM
form.addEventListener('submit', trekerTripDest);

//EVENT LISTENER FOR Print button at result page
printBtn.addEventListener('click', function (e) {
  window.print();
  location.reload();
})

//EVENT LISTENER FOR Delete button at result page
deleteBtn.addEventListener('click', function (e) {
  form.reset();
  result.classList.add("hide");
  location.reload();
})

// STAR TREKER FUNCTIONS 

// SETUP FOR FUNCTIONS
export function trekerTripDest(e) {
  e.preventDefault();
  //Obtain and store the star treker trip data
  const leavingFromText = leavingFrom.value;
  const goingToText = goingTo.value;
  const depDateText = depDate.value;
  const timestamp = (new Date(depDateText).getTime()) / 1000;

  //function checkInput to validate input
  Client.checkInput(leavingFromText, goingToText);

  getCityInfo(geonamesURL, goingToText, username)
    .then((cityData) => {
      const cityLat = cityData.geonames[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName;
      const weatherData = getWeather(cityLat, cityLong, country, timestamp)
      return weatherData;
      console.log(getCityInfo);

    })
    .then((weatherData) => {
      const daysLeft = Math.round((timestamp - timestampNow) / 86400);
      const userData = postData('http://localhost:3000/add', { leavingFromText, goingToText, depDateText, weather: weatherData.data[15].temp * 9 / 5 + 32, daysLeft })
      return userData;

    })
    .then((userData) => {
      updateUI(userData);
    })
}

//Here the FETCH to Geonames API location
export const getCityInfo = async (geonamesURL, goingToText, username) => {
  const res = await fetch(geonamesURL + goingToText + "&maxRows=10&" + "username=" + username);
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};

// function weatherbit will let user to get weather info from their API
export const getWeather = async (cityLat, cityLong) => {
  const req = await fetch(weatherbitApiURL + "lat=" + cityLat + "&lon=" + cityLong + "&key=" + weatherbitApiKEY);
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error)
  }
}

//Post information to the local server
export const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.leavingFromText,
      arrCity: data.goingToText,
      depDate: data.depDateText,
      weather: data.weather,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log('error'), error;
  }
}

//Updates UI with information from API
export const updateUI = async (userData) => {
  result.classList.remove("hide");
  result.scrollIntoView({ behavior: "smooth" });

  const res = await fetch(pixabayApiURL + pixabayApiKEY + "&q=" + userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dateSplit = userData.depDate.split("_").reverse().join(" / ");
    document.querySelector("#pixabayImage").setAttribute('src', imageLink.hits[0].webformatURL);
    document.querySelector('#city').innerHTML = userData.arrCity;
    document.querySelector('#date').innerHTML = dateSplit;
    document.querySelector('#days').innerHTML = userData.daysLeft;
    document.querySelector('#temp').innerHTML = userData.weather;

  }
  catch (error) {
    console.log("error", error)
  }
}

