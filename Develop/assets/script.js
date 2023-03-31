var previousBtn = document.querySelector("#previous");
var nextBtn = document.querySelector("#next");
var weekSlide = document.getElementById("week-slide");

let x = 0;
function next() {
    weekSlide.style.transform = "translateX(-40px)";    
}

function previous() {
    weekSlide.style.transform = "translateX(0)";
}



nextBtn.addEventListener("click", next);
previousBtn.addEventListener("click", previous);

// SEARCH WITH TIME FUNCTIONALITY
var currentTime = document.getElementById("current-time");
var AMPM = document.getElementById("am-pm");
var timeOfDay = document.getElementById("time-of-day");
var userName = document.getElementById("user-name");
var currentDate = document.getElementById("current-date");
var timeIcon = document.getElementById("time-icon");
// Input value
var cityName = document.getElementById("city-name");
var searchBtn = document.getElementById("search");

setInterval(function() {
    var time = dayjs();
    var now = time.format('h:mm');
    var nowAMPM = time.format('A');

    currentTime.innerText = now;
    AMPM.innerText = nowAMPM;

    var hour = time.format('H');
    if (+hour >= 0 && +hour < 12) {
        timeOfDay.innerText = "MORNING";
        timeIcon.src = "./assets/mint/morning_sm.png";
    } else if (+hour >= 12 && +hour < 17) {
        timeOfDay.innerText = "AFTERNOON";
        timeIcon.src = "./assets/mint/afternoon.png";
    } else if (+hour >= 17 && +hour <= 23) {
        timeOfDay.innerText = "EVENING";
        timeIcon.src = "./assets/mint/evening.png";
    }

    var fullDate = "";
    var dateNow = time.format("dddd MMM D");
    var dateNum = time.format("DD");
    var dateYear = time.format("YYYY");
    
    // Adds "st", "nd", "rd", and "th" into correct spots
    if (dateNum[dateNum.length - 1] === "1") {
        fullDate += dateNow + "st, " + dateYear;
    }
    else if (dateNum[dateNum.length - 1] === "2") {
        fullDate += dateNow + "nd, " + dateYear;
    }
    else if (dateNum[dateNum.length - 1] === "3") {
        fullDate += dateNow + "rd, " + dateYear;
    } else {
        fullDate += dateNow + "th, " + dateYear;
    }
    currentDate.innerText = fullDate;

}, 1000);




// LARGE DASHBOARD OF CURRENT WEATHER
var cityChose = document.getElementById("city");
var climate = document.getElementById("climate");
var currentTemp = document.getElementById("current-temp");
var minTemp = document.getElementById("min");
var maxTemp = document.getElementById("max");
var sunrise = document.getElementById("sunrise");
var sunset = document.getElementById("sunset");

// RIGHT DASHBOARD OF CURRENT WEATHER CONDITIONS
var feelsLike = document.getElementById("feels-like-degrees");
var humidity = document.getElementById("humidity-percent");
var speed = document.getElementById("speed-miles");

var searchContainer = document.querySelector(".search-container");

var listOfCities = [];

searchBtn.addEventListener("click", function() {
    var citySelect = cityName.value;
    fetchWeather(citySelect.toLowerCase());

        
    const para = document.createElement("p");
    const div = document.createElement("div");

    if (listOfCities.length < 13) {
        listOfCities.unshift(citySelect);

        
        para.innerHTML = listOfCities[0];

        div.setAttribute("class", "search-option");
        div.appendChild(para);

        searchContainer.appendChild(div);

    } else if (listOfCities.length >= 13) {
        listOfCities.pop();
        // listOfCities.unshift(citySelect);

        // para.innerHTML = listOfCities[0];

        // div.setAttribute("class", "search-option");
        // div.appendChild(para);

        // searchContainer.appendChild(div);
    }

    console.log(listOfCities.length);
    

    
})

// Fetches current weather based on user's location
function currentWeather() {
    var currentURL = "https://ipapi.co/json/"

    fetch(currentURL)
        .then(response => response.json())
        // Pass in fetchWeather function to get specific location of user
        .then(function(data) {
            fetchWeather(data.city);
            
            // sunset.innerText = changeTimeZone(new Date(data.sys.sunset * 1000), data.timezone);
        })
}

currentWeather();

function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
    return new Date(
        date.toLocaleString('en-US', {
          timeZone,
        }),
    );
    
}

var apiKey = "fc1cecfce950939c0c23f9e6811123bf";

var currentLocationUrl = "https://ipapi.co/json/";



// Fetches any weather from any city and passes values into
// appropriate spots in the HTML
function fetchWeather(city) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&limit=1&units=imperial&appid=" + apiKey;

    fetch(weatherURL)
        .then(response => response.json())
        .then(function(data) {
            cityChose.innerText = data.name;
            currentTemp.innerText = Math.round(data.main.temp);
            climate.innerText = data.weather[0].description;
            minTemp.innerText = Math.round(data.main.temp_min);
            maxTemp.innerText = Math.round(data.main.temp_max);
            

            feelsLike.innerText = Math.round(data.main.feels_like);
            humidity.innerText = data.main.humidity;
            speed.innerText = data.wind.speed.toFixed(1);

            // sunrise.innerText = changeTimeZone(new Date(data.sys.sunrise * 1000), timezone);
            // sunrise.innerText = changeTimeZone(new Date(data.sys.sunset * 1000), timezone);

            console.log(data);
            

            
        });
        

    // var fiveDayURL = 

    // fetch(fiveDayURL)
    //     .then(response => response.json())
    //     .then(data => console.log(data));

    
}