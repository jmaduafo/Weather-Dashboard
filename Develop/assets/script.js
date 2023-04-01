var previousBtn = document.querySelector("#previous");
var nextBtn = document.querySelector("#next");
var weekSlide = document.getElementById("week-slide");

let x = 0;
function next() {
    if (x < 4) {
        x++;
        weekSlide.style.transform = "translateX(-" + 80 * x + "px)"; 
    } else if (x <= 4){
        x = 4;
        weekSlide.style.transform = "translateX(-" + 80 * x + "px)"; 
    }

}

function previous() {
    if (x > 0) {
        x--;
        weekSlide.style.transform = "translateX(-" + 80 * x + "px)";
    } else if (x <= 0){
        x = 0
        weekSlide.style.transform = "translateX(-" + 80 * x + "px)";
    }

    
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
var cityName = document.querySelector("#city-name");
var searchBtn = document.querySelector("#search");

setInterval(function() {
    var time = dayjs();
    var now = time.format('h:mm');
    var nowAMPM = time.format('A');

    currentTime.innerText = now;
    AMPM.innerText = nowAMPM;

    var hour = time.format('H');
    if (+hour >= 0 && +hour < 12) {
        timeOfDay.innerText = "MORNING";
        // timeIcon.src = "./assets/mint/morning_sm.png";
    } else if (+hour >= 12 && +hour < 17) {
        timeOfDay.innerText = "AFTERNOON";
        // timeIcon.src = "./assets/mint/afternoon.png";
    } else if (+hour >= 17 && +hour <= 23) {
        timeOfDay.innerText = "EVENING";
        // timeIcon.src = "./assets/mint/evening.png";
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

var weekSlide = document.querySelector(".week-slide");

searchBtn.addEventListener("click", function() {
    var citySelect = cityName.value;

    fetchWeather(citySelect.toLowerCase());
    // getIcons(citySelect.toLowerCase());
        
    const para = document.createElement("p");
    const div = document.createElement("div");

    para.setAttribute("id", "list-paragraph");
    div.setAttribute("id", "search-option");

    if (listOfCities.length < 13) {
        listOfCities.unshift(citySelect);

        
        para.innerHTML = listOfCities[0];

        div.classList.add("search-option");
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

// function changeTimeZone(date, timeZone) {
//     if (typeof date === 'string') {
//       return new Date(
//         new Date(date).toLocaleString('en-US', {
//           timeZone,
//         }),
//       );
//     }
//     return new Date(
//         date.toLocaleString('en-US', {
//           timeZone,
//         }),
//     );
    
// }

var apiKey = config.WEATHER_API_TOKEN;

var fiveWeek = document.querySelectorAll(".five-day-week");
var minimumTemp = document.querySelectorAll(".minimum");
var maximumTemp = document.querySelectorAll(".maximum");
var humidPer = document.querySelectorAll(".five-humid-per");
var windMPH = document.querySelectorAll(".five-wind-mph");


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

            // Create a nested fetch to get the five day forecast            
            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + data.coord.lat+ "&lon=" + data.coord.lon + "&units=imperial&appid=" + apiKey;

            fetch(fiveDayURL)
                .then(response => response.json())
                .then(function(five) {
                    console.log(five);
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    
                    var i = 1;
                    

                    while (i < 6) {
                        var date = dayjs();
                        fiveWeek[i - 1].innerHTML = weekday[(date.day() + 7 + i) % 7];                   
                        
                        i++;
                    }
                    
                    var x = 1;
                    while (x < 5) {
                        console.log(five.list[0].dt);
                        minimumTemp[x - 1].innerHTML = Math.round(five.list[x*8].main.temp_min) + "°";
                        maximumTemp[x - 1].innerHTML = Math.round(five.list[x*8].main.temp_max) + "°";
                        windMPH[x - 1].innerHTML = five.list[x*8].wind.speed.toFixed(1) + " mph";
                        humidPer[x - 1].innerHTML = five.list[x*8].main.humidity + "%";
                        
                        x++;
                    }

                    minimumTemp[4].innerHTML = Math.round(five.list[five.list.length - 1].main.temp_min) + "°";
                    maximumTemp[4].innerHTML = Math.round(five.list[five.list.length - 1].main.temp_max) + "°";
                    windMPH[4].innerHTML = five.list[five.list.length - 1].wind.speed.toFixed(1) + " mph";
                    humidPer[4].innerHTML = five.list[five.list.length - 1].main.humidity + "%";                        
                        
                       
                    })

                    
                })

            
        };    


// function getIcons(city) {
//     var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&limit=1&units=imperial&appid=" + apiKey;

//     fetch(weatherURL)
//         .then(response => response.json())
//         .then(function(data) {
//             if (data.weather[0].main === "Clear" && mintClicked) { 

//             }
//         })
// }

function setMoment() {
    setInterval(function() {
        var currentHour = dayjs().format("H");

        if (currentHour >= 0 &&  currentHour < 12 && localStorage.getItem("mulberry" === "true")) {
            timeIcon.src = "../mulberry/morning_sm.png";
        }
        if (currentHour >= 0 && currentHour < 12 && localStorage.getItem("mint" === "true")) {
            timeIcon.src = "../mint/morning.png";
        }
        if (currentHour >= 0 && currentHour < 12 && localStorage.getItem("bubblegum" === "true")) {
            timeIcon.src = "../bubblegum/morning.png";
        }
        if (currentHour >= 12 &&  currentHour < 17 && localStorage.getItem("mulberry" === "true")) {
            timeIcon.src = "./mulberry/afternoon.png";
        }
        if (currentHour >= 12 &&  currentHour < 17 && localStorage.getItem("mint" === "true")) {
            timeIcon.src = "./mint/afternoon.png";
        }
        if (currentHour >= 12 &&  currentHour < 17 && localStorage.getItem("bubblegum" === "true")) {
            timeIcon.src = "./bubblegum/afternoon.png";
        }
        if (currentHour >= 17 &&  currentHour <= 23 && localStorage.getItem("mulberry" === "true")) {
            timeIcon.src = "../mulberry/evening.png";
        }
        if (currentHour >= 17 &&  currentHour <= 23 && localStorage.getItem("mint" === "true")) {
            timeIcon.src = "../mint/evening.png";
        }
        if (currentHour >= 17 &&  currentHour <= 23 && localStorage.getItem("bubblegum" === "true")) {
            timeIcon.src = "../bubblegum/evening.png";
        }
    }, 1000)
    
}

setMoment();



var mint = document.querySelector(".mint-btn");
var mulberry = document.querySelector(".mulberry-btn");
var bubblegum = document.querySelector(".bubblegum-btn");

var mainContainer = document.querySelector("#main-container");
var searchContainer = document.querySelector("#search-container");

var fiveDay = document.querySelectorAll(".five-day");
var divider = document.querySelectorAll(".divider");
var iconic = document.querySelectorAll(".bx");
var largeDash = document.querySelector(".major-left-weather");

var h5 = document.querySelectorAll("h5");
var h3 = document.querySelectorAll("h3");
var pTag = document.querySelectorAll("p");

var feelsLikeBackground = document.querySelector("#feels-like");
var humidityBackground = document.querySelector("#humidity");
var windSpeedBackground = document.querySelector("#wind-speed");
var inputSelect = document.getElementById("city-name");
var fiveTitle = document.getElementById("five-title");

var feelsIcon = document.getElementById("feels-icon");
var humidityIcon = document.getElementById("humidity-icon");
var speedIcon = document.getElementById("speed-icon");
var fiveIcon = document.getElementById("five-icon");
var greeting = document.getElementById("greeting");


const listParagraph = document.querySelector("#list-paragraph");
const searchOption = document.getElementById("#search-option");



// Function enables user to change color theme of dashboard
function mode(firstMode, secondMode, thirdMode) {
    document.body.classList.add(firstMode + "-background");
    document.body.classList.remove(secondMode + "-background");
    document.body.classList.remove(thirdMode + "-background");

    mainContainer.classList.add(firstMode + "-body");
    mainContainer.classList.remove(secondMode + "-body");
    mainContainer.classList.remove(thirdMode + "-body");


    currentTime.classList.add(firstMode + "-time");
    currentTime.classList.remove(secondMode + "-time");
    currentTime.classList.remove(thirdMode + "-time");

    AMPM.classList.add(firstMode + "-time");
    AMPM.classList.remove(secondMode + "-time");
    AMPM.classList.remove(thirdMode + "-time");

    h5.forEach(element => {
        element.classList.add(firstMode + "-text")
        element.classList.remove(secondMode + "-text")
        element.classList.remove(thirdMode + "-text")
    })

    h3.forEach(element => {
        element.classList.add(firstMode +"-text")
        element.classList.remove(secondMode +"-text")
        element.classList.remove(thirdMode +"-text")
    })

    pTag.forEach(element => {
        element.classList.add(firstMode +"-text")
        element.classList.remove(secondMode +"-text")
        element.classList.remove(thirdMode +"-text")
    })

    iconic.forEach(element => {
        element.classList.add(firstMode +"-text")
        element.classList.remove(secondMode +"-text")
        element.classList.remove(thirdMode +"-text")
    })

    fiveDay.forEach(element => {
        element.classList.add(firstMode +"-background")
        element.classList.remove(secondMode +"-background")
        element.classList.remove(thirdMode +"-background")
    })

    divider.forEach(element => {
        element.classList.add(firstMode +"-divider")
        element.classList.remove(secondMode +"-divider")
        element.classList.remove(thirdMode +"-divider")
    })

    feelsLikeBackground.classList.add(firstMode + "-background");
    feelsLikeBackground.classList.remove(secondMode + "-background");
    feelsLikeBackground.classList.remove(thirdMode + "-background");

    humidityBackground.classList.add(firstMode + "-background");
    humidityBackground.classList.remove(secondMode + "-background");
    humidityBackground.classList.remove(thirdMode + "-background");

    windSpeedBackground.classList.add(firstMode + "-background");
    windSpeedBackground.classList.remove(secondMode + "-background");
    windSpeedBackground.classList.remove(thirdMode + "-background");

    searchContainer.classList.add(firstMode + "-background");
    searchContainer.classList.remove(secondMode + "-background");
    searchContainer.classList.remove(thirdMode + "-background");
    
    inputSelect.classList.add(firstMode + "-background");
    inputSelect.classList.remove(secondMode + "-background");
    inputSelect.classList.remove(thirdMode + "-background");

    searchBtn.classList.add(firstMode + "-divider");
    searchBtn.classList.remove(secondMode + "-divider");
    searchBtn.classList.remove(thirdMode + "-divider");

    previousBtn.classList.add(firstMode + "-divider");
    previousBtn.classList.remove(secondMode + "-divider");
    previousBtn.classList.remove(thirdMode + "-divider");

    nextBtn.classList.add(firstMode + "-divider");
    nextBtn.classList.remove(secondMode + "-divider");
    nextBtn.classList.remove(thirdMode + "-divider");

    inputSelect.classList.add(firstMode + "-place");
    inputSelect.classList.remove(secondMode + "-place");
    inputSelect.classList.remove(thirdMode + "-place");

    largeDash.classList.add(firstMode + "-gradient");
    largeDash.classList.remove(secondMode + "-gradient");
    largeDash.classList.remove(thirdMode + "-gradient");

    if (firstMode === "mulberry") {
        feelsIcon.style.color = "#FFBF84";
        humidityIcon.style.color = "#FFBF84";
        speedIcon.style.color = "#FFBF84";
        fiveIcon.style.color = "#FFBF84";
        fiveTitle.style.color = "#FFBF84";
        // searchOption.style.borderBottomColor = "#FFBF84";
        inputSelect.style.backgroundColor = "#8C3B3B";
        inputSelect.style.color = "#FFBF84";
        greeting.style.color = "#FFBF84";
    }
    if (firstMode === "mint") {
        feelsIcon.style.color = "#7BADA1";
        humidityIcon.style.color = "#7BADA1";
        speedIcon.style.color = "#7BADA1";
        fiveIcon.style.color = "#7BADA1";
        fiveTitle.style.color = "#7BADA1";
        // searchOption.style.borderBottomColor = "#7BADA1";
        inputSelect.style.backgroundColor = "#E8FFFE";
        inputSelect.style.color = "#7BADA1";
        greeting.style.color = "#FFFFFF";
    }
    if (firstMode === "bubblegum") {
        feelsIcon.style.color = "#FE6262";
        humidityIcon.style.color = "#FE6262";
        speedIcon.style.color = "#FE6262";
        fiveIcon.style.color = "#FE6262";
        fiveTitle.style.color = "#FE6262";
        // searchOption.style.borderBottomColor = "#FE6262";
        inputSelect.style.backgroundColor = "#FFCCCC";
        inputSelect.style.color = "#FE6262";
        greeting.style.color = "#FFA7A7";
    }

    
}

if (localStorage.getItem("mulberry") === "true") {
    mode("mulberry", "mint", "bubblegum");
} else if (localStorage.getItem("mint") === "true") {
    mode("mint", "mulberry", "bubblegum");
} else if (localStorage.getItem("bubblegum") === "true") {
    mode("bubblegum", "mint", "mulberry");
}

// If mulberry button is clicked (burgundy), change to mulberry mode
// remove other modes
mulberry.addEventListener("click", function() {
    localStorage.setItem("mulberry", true);
    localStorage.setItem("bubblegum", false);
    localStorage.setItem("mint", false);

    mode("mulberry", "mint", "bubblegum");
    
})

// If bubblegum button is clicked (pink), change to bubblegum mode
// remove other modes
bubblegum.addEventListener("click", function() {
    localStorage.setItem("mulberry", false);
    localStorage.setItem("mint", false);
    localStorage.setItem("bubblegum", true);

    mode("bubblegum", "mint", "mulberry");
})

// If mint button is clicked (mint green), change to mint mode and
// remove other modes
mint.addEventListener("click", function() {
    localStorage.setItem("mulberry", false);
    localStorage.setItem("bubblegum", false);
    localStorage.setItem("mint", true);

    mode("mint", "mulberry", "bubblegum");
})