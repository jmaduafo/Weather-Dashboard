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

    // Gets the time of day and renders based on user's current time
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
var sunriseTime = document.getElementById("sunrise-time");
var sunsetTime = document.getElementById("sunset-time");

// RIGHT DASHBOARD OF CURRENT WEATHER CONDITIONS
var feelsLike = document.getElementById("feels-like-degrees");
var humidity = document.getElementById("humidity-percent");
var speed = document.getElementById("speed-miles");

var searchContainer = document.querySelector(".search-container");

var cancel = document.getElementById("cancel");

// Initializes list to add to localstorage
var historyObj = { city: [] };

// On refresh, the city history is rendered
function onLoad() {
  if(localStorage.getItem('history')) {
    historyObj = JSON.parse(localStorage.getItem('history'));

    historyObj.city.forEach(function(i, idx, city) {
        const para = document.createElement("p");
        const div = document.createElement("div");
        

        para.setAttribute("id", "list-paragraph");
        div.setAttribute("class", "search-option");

        para.innerHTML = city[idx];

        div.appendChild(para);
        searchContainer.appendChild(div);   

        if (localStorage.getItem("mulberry") === "true") {
            para.classList.add("mulberry-text");
            para.classList.remove("mint-text");
            para.classList.remove("bubblegum-text");
            
        }
        else if (localStorage.getItem("mint") === "true") {
            para.classList.add("mint-text");
            para.classList.remove("mulberry-text");
            para.classList.remove("bubblegum-text");
            
        }
        else if (localStorage.getItem("bubblegum") === "true") {
            para.classList.add("bubblegum-text");
            para.classList.remove("mint-text");
            para.classList.remove("mulberry-text");
            
        }
        
        // Allows names listed in the history to be reselected and renders
        // the selected name on the dashboard
        div.addEventListener("click", function() {
            fetchWeather(this.firstChild.innerHTML);
        })           
    })
    

  }
}

// Call function so that after refresh, all elements on the list are displayed
// on the application
onLoad();

// Adds the last element in history list and renders on application
function lastElement() {
    if(localStorage.getItem('history')) {
        historyObj = JSON.parse(localStorage.getItem('history'));
  
      
        const para = document.createElement("p");
        const div = document.createElement("div");
        

        para.setAttribute("id", "list-paragraph");
        div.setAttribute("class", "search-option");

        para.innerHTML = historyObj.city[historyObj.city.length - 1];

        div.appendChild(para);
        searchContainer.appendChild(div);

        para.style.color = "rgba(0, 0, 0, .4)"; 
        
        // Allows names listed in the history to be reselected and renders
        // the selected name on the dashboard
        div.addEventListener("click", function() {
            fetchWeather(this.firstChild.innerHTML);
        })
  
    }
}

// Deletes history and removes all elements in the search container
cancel.addEventListener("click", function() {
    historyObj = {city: []}
    localStorage.removeItem("history");
    searchContainer.innerHTML = '';
    
})


// Function adds the city history to list after setting the item
// in the local storage
function addHistory(dataToSave) {
  historyObj.city.push(dataToSave);
  localStorage.setItem('history', JSON.stringify(historyObj));
}

// Catches the error if input is invalid
function undefinedInput() {
    cityChose.innerHTML = "---";
    document.getElementById("undefined").style.visibility = "visible";
}


var weekSlide = document.querySelector(".week-slide");

// After search button is clicked, the system gets the value in the input and passes it into the
// fetchWeather() function and allows all the appropriate data to render on the page and calls
// history and render functions
searchBtn.addEventListener("click", function() {
    var citySelect = cityName.value;
    
    fetchWeather(citySelect.toLowerCase());
    
    addHistory(citySelect);
    lastElement();
})

// Fetches current weather based on user's location
function currentWeather() {
    // An ip address API
    var currentURL = "https://ipapi.co/json/"

    fetch(currentURL)
        .then(response => response.json())
        // Pass in fetchWeather function to get specific location of user
        .then(function(data) {
            fetchWeather(data.city);
        })
        .catch(err => console.log(err))
}

currentWeather();


var apiKey = "fc1cecfce950939c0c23f9e6811123bf";

var fiveWeek = document.querySelectorAll(".five-day-week");
var minimumTemp = document.querySelectorAll(".minimum");
var maximumTemp = document.querySelectorAll(".maximum");
var humidPer = document.querySelectorAll(".five-humid-per");
var windMPH = document.querySelectorAll(".five-wind-mph");
var iconic = document.querySelectorAll(".iconic");
var iconic1 = document.getElementById("iconic-1");
var iconic2 = document.getElementById("iconic-2");
var iconic3 = document.getElementById("iconic-3");
var iconic4 = document.getElementById("iconic-4");
var iconic5 = document.getElementById("iconic-5");

var iconMain = document.querySelector(".icon-main");
var iconMainId = document.querySelector("#icon-main");


// Function enables system to fetch any weather from any city and passes values into
// appropriate spots in the HTML
function fetchWeather(city) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&limit=1&units=imperial&appid=" + apiKey;

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            if (data.name === undefined || data.name === null) {
                undefinedInput();
            } else {
                console.log(data);
                document.getElementById("undefined").style.visibility = "hidden";
                cityChose.innerText = data.name;
                currentTemp.innerText = Math.round(data.main.temp);
                climate.innerText = data.weather[0].description;
                minTemp.innerText = Math.round(data.main.temp_min);
                maxTemp.innerText = Math.round(data.main.temp_max);
                

                feelsLike.innerText = Math.round(data.main.feels_like);
                humidity.innerText = data.main.humidity;
                speed.innerText = data.wind.speed.toFixed(1);

                if (data.weather[0].main === "Clouds") {
                    iconMain.setAttribute("class", "bx bxs-cloud bx-sm");
                } else if (data.weather[0].main === "Thunderstorm") {
                    iconMain.setAttribute("class", "bx bx-cloud-lightning bx-sm");
                } else if (data.weather[0].main === "Drizzle") {
                    iconMain.setAttribute("class", "bx bx-cloud-drizzle bx-sm");
                } else if (data.weather[0].main === "Rain") {
                    iconMain.setAttribute("class", "bx bx-cloud-rain bx-sm");
                } else if (data.weather[0].main === "Snow") {
                    iconMain.setAttribute("class", "bx bx-cloud-snow bx-sm");
                } else if (data.weather[0].main === "Clear") {
                    iconMain.setAttribute("class", "bx bxs-leaf bx-sm");
                } else {
                    iconMain.setAttribute("class", "bx bx-wind bx-sm");
                }

            }


            // API gets the sunrise and sunset times in the location's local time
            // (The times are a little inaccurate ngl)
            var sunURL = "https://api.sunrise-sunset.org/json?lat="+ data.coord.lat + "&lng=" + data.coord.lon + "&date=today";
            
            fetch(sunURL)
                .then(response => response.json())
                .then(data => {
                    if(data.results.sunset.length === 10) {
                        sunset.innerText = data.results.sunset.substring(0, 4);
                    } 
                    if (data.results.sunrise.length === 10) {
                        sunrise.innerText = data.results.sunrise.substring(0, 4);
                    } 
                    if (data.results.sunrise.length === 11) {
                        sunrise.innerText = data.results.sunrise.substring(0, 5);
                    } 
                    if (data.results.sunset.length === 11) {
                        sunset.innerText = data.results.sunset.substring(0, 5);
                    }
                    
                    sunsetTime.innerText = data.results.sunset.slice(-2);
                    sunriseTime.innerText = data.results.sunrise.slice(-2);
                })

            // Create a nested fetch to get the five day forecast            
            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + data.coord.lat+ "&lon=" + data.coord.lon + "&units=imperial&appid=" + apiKey;

            fetch(fiveDayURL)
                .then(response => response.json())
                .then(function(five) {
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    
                    
                
                    
                    var i = 1;
                    while (i < 6) {
                        var date = dayjs();
                        fiveWeek[i - 1].innerHTML = weekday[(date.day() + 7 + i) % 7];                   
                        
                        i++;
                    }
                   
                   
                    
                    var x = 1;
                    while (x < 5) {
                        // Sets values
                        minimumTemp[x - 1].innerHTML = Math.round(five.list[x*8].main.temp_min) + "°";
                        maximumTemp[x - 1].innerHTML = Math.round(five.list[x*8].main.temp_max) + "°";
                        windMPH[x - 1].innerHTML = five.list[x*8].wind.speed.toFixed(1) + " mph";
                        humidPer[x - 1].innerHTML = five.list[x*8].main.humidity + "%";

                        if (five.list[x*8].weather[0].main === "Clouds") {
                            iconic[x - 1].setAttribute("class", "bx bxs-cloud bx-sm");
                        } else if (five.list[x*8].weather[0].main === "Thunderstorm") {
                            iconic[x - 1].setAttribute("class", "bx bx-cloud-lightning bx-sm");
                        } else if (five.list[x*8].weather[0].main === "Drizzle") {
                            iconic[x - 1].setAttribute("class", "bx bx-cloud-drizzle bx-sm");
                        } else if (five.list[x*8].weather[0].main === "Rain") {
                            iconic[x - 1].setAttribute("class", "bx bx-cloud-rain bx-sm");
                        } else if (five.list[x*8].weather[0].main === "Snow") {
                            iconic[x - 1].setAttribute("class", "bx bx-cloud-snow bx-sm");
                        } else if (five.list[x*8].weather[0].main === "Clear") {
                            iconic[x - 1].setAttribute("class", "bx bxs-leaf bx-sm");
                        } else {
                            iconic[x - 1].setAttribute("class", "bx bx-wind bx-sm");
                        }
                        
                        x++;
                    }

                    // Sets values for the last element
                    minimumTemp[4].innerHTML = Math.round(five.list[five.list.length - 1].main.temp_min) + "°";
                    maximumTemp[4].innerHTML = Math.round(five.list[five.list.length - 1].main.temp_max) + "°";
                    windMPH[4].innerHTML = five.list[five.list.length - 1].wind.speed.toFixed(1) + " mph";
                    humidPer[4].innerHTML = five.list[five.list.length - 1].main.humidity + "%";

                    if (five.list[five.list.length - 1].weather[0].main === "Clouds") {
                        iconic[4].setAttribute("class", "bx bxs-cloud bx-sm");
                    } else if (five.list[five.list.length - 1].weather[0].main === "Thunderstorm") {
                        iconic[4].setAttribute("class", "bx bx-cloud-lightning bx-sm");
                    } else if (five.list[five.list.length - 1].weather[0].main === "Drizzle") {
                        iconic[4].setAttribute("class", "bx bx-cloud-drizzle bx-sm");
                    } else if (five.list[five.list.length - 1].weather[0].main === "Rain") {
                        iconic[4].setAttribute("class", "bx bx-cloud-rain bx-sm");
                    } else if (five.list[five.list.length - 1].weather[0].main === "Snow") {
                        iconic[4].setAttribute("class", "bx bx-cloud-snow bx-sm");
                    } else if (five.list[five.list.length - 1].weather[0].main === "Clear") {
                        iconic[4].setAttribute("class", "bx bxs-leaf bx-sm");
                    } else {
                        iconic[4].setAttribute("class", "bx bx-wind bx-sm");
                    }                  
                        
                       
                    })

                    
                })
                // Error catch
                .catch(err => {
                    undefinedInput();
                    console.log(err);
                })       
        }
 




var mint = document.querySelector(".mint-btn");
var mulberry = document.querySelector(".mulberry-btn");
var bubblegum = document.querySelector(".bubblegum-btn");

var mainContainer = document.querySelector("#main-container");
var searchContainer = document.querySelector("#search-container");

var fiveDay = document.querySelectorAll(".five-day");
var divider = document.querySelectorAll(".divider");
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

var weekWeather = document.querySelector(".week-weather");
var body = document.querySelector("body");


const searchOption = document.getElementById("#search-container div");



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

    iconMain.classList.add(firstMode +"-text")
    iconMain.classList.remove(secondMode +"-text")
    iconMain.classList.remove(thirdMode +"-text")

    cancel.classList.add(firstMode +"-text")
    cancel.classList.remove(secondMode +"-text")
    cancel.classList.remove(thirdMode +"-text")

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

    weekWeather.classList.add(firstMode + "-thumb");
    weekWeather.classList.remove(secondMode + "-thumb");
    weekWeather.classList.remove(thirdMode + "-thumb");

    weekWeather.classList.add(firstMode + "-track");
    weekWeather.classList.remove(secondMode + "-track");
    weekWeather.classList.remove(thirdMode + "-track");

    largeDash.classList.add(firstMode + "-gradient");
    largeDash.classList.remove(secondMode + "-gradient");
    largeDash.classList.remove(thirdMode + "-gradient");

    if (firstMode === "mulberry") {
        feelsIcon.style.color = "#FFBF84";
        humidityIcon.style.color = "#FFBF84";
        speedIcon.style.color = "#FFBF84";
        fiveIcon.style.color = "#FFBF84";
        fiveTitle.style.color = "#FFBF84";
        inputSelect.style.backgroundColor = "#8C3B3B";
        inputSelect.style.color = "#FFBF84";
        greeting.style.color = "#FFBF84";
        iconMainId.style.color = "#FFBF84";
        iconic1.style.color = "#FFBF84";
        iconic2.style.color = "#FFBF84";
        iconic3.style.color = "#FFBF84";
        iconic4.style.color = "#FFBF84";
        iconic5.style.color = "#FFBF84";
    }
    if (firstMode === "mint") {
        feelsIcon.style.color = "#7BADA1";
        humidityIcon.style.color = "#7BADA1";
        speedIcon.style.color = "#7BADA1";
        fiveIcon.style.color = "#7BADA1";
        fiveTitle.style.color = "#7BADA1";
        iconMainId.style.color = "#7BADA1";
        iconic1.style.color = "#7BADA1";
        iconic2.style.color = "#7BADA1";
        iconic3.style.color = "#7BADA1";
        iconic4.style.color = "#7BADA1";
        iconic5.style.color = "#7BADA1";
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
        iconMainId.style.color = "#FE6262";
        iconic1.style.color = "#FE6262";
        iconic2.style.color = "#FE6262";
        iconic3.style.color = "#FE6262";
        iconic4.style.color = "#FE6262";
        iconic5.style.color = "#FE6262";
        inputSelect.style.backgroundColor = "#FFCCCC";
        inputSelect.style.color = "#FE6262";
        greeting.style.color = "#FFA7A7";
    }

    
}


setInterval(function() {
    var currentHour = dayjs().format("H"); 

    if (+currentHour >= 0 &&  +currentHour < 12 && localStorage.getItem("mulberry") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABh0lEQVR4nNVVzU4CMRDeEx7VQDj48yIGXwiBV6jJjOjV1+BqgkG0I2wCgiImvol6H7NT2C0uXVqNiTaZpJ125vvaab9GUUBjwgfWMIp+qzEhJ/Z3AZjUDhM0mVRl7bzGmDUMHbEVie1fbBcxbAhLDa/cU1VvYj1VlRgTe+Je2G+Xs4U49QbQ8JgS67fLm9kQPrGGsYy7l1ussSU3iODDWNLHBndUaQEwlpiAXRuwW9xnwpdlcXOmYZ6sCUqaJk+YU0HyFASflzsJAzDHwl5WVFgnAMFEgu/giAlquaS2f1EvF9PY2m5s+d+NH2p8f3acZ275Nbw58606skeUAaDPETkA1j/KxRHJVWRPgHABNJKBViJ1kM4N4PDLTaqHA8gDg7nFsiuJE9N4bdVi9q1rmj40bYHkCz3jG7UXllSkAmZMOJBxR5VEFjSMpPBi0q9bUjH0kooVVSSYeJPSOPUSu/RsfyLXBE33QoJT1njlSs4Ff7KRemxxfL7rS+wf/snRJoCCP9nVPgF2FIi8Tk4jUwAAAABJRU5ErkJggg==";
    }
    if (+currentHour >= 0 && +currentHour < 12 && localStorage.getItem("mint") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABMUlEQVR4nM2V3UrDQBCFc9VeqrTkwp8XEX2h1voMvpOg16bQtPUngm9ivf9k4CyMZTfuRoQeCCSzM+fMJrMnVVUAYA2sqv8CwuEKAMfAApgm1pdAk1ibqvaoT+BGTX4AdUFjtWoM877EiUvcFgg8u8YmOd28AK2ex8CtJuhL11q7HSmnVU32roPYGfBOGp3lFJE68vEv5AFvYSelAvZacjEfIrBR8SVwFSH18baPyGY7YOniO8WM5Doi4OOfSb69QBMRyEFKIHooQ6KNYi7KDVDH3uPcrV38WIHZ0DHtHMmDiO16dPHXQWPqDlpHGkZ+Wkpaq/BJzyPZwkoffqf7mbOKJssq9lxxU9DUNsvs3Lv9i10v+hLvgPsUOT3/ZFm92ctJbmMxEgyDCQ5BIPlPTuEbJEkpd7mjcnoAAAAASUVORK5CYII=";
    }
    if (+currentHour >= 0 && +currentHour < 12 && localStorage.getItem("bubblegum") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkUlEQVR4nNVVS07DMBDNCpaAQCz4XATBvheIkjfpZ18oZ+BOSLCGSlA+pUiwQIXYFHECyr7oRXXlljp1ipBgpJHiycy8Z49nHAQFRIu0lMhF8FuiRQbUvwuga7VlFceNJ2DNAdDUwPm0f4xhbBqGS06AFDjIWAIPL+Xyui8x+jKGsa8i+07H90pl1Thq4NoXQIvcGGLMMZONErlVwCXX3VJpUYkcZjcI+KTym7t9DMMF+tCXMUV2nclbtbqpgXtT3ElVQIc+wTxC5nnJRyAid2YnhWR4LAMfzS2sS7TIVRYcRTspsPstqWU39XIlalqBTcvep41J0iTZmwQYswMfznxjBquJDID2UReAoymNY8sXYK4ByLa3k3STZMv8e46i7Ykd1AsDZA0GdKw7f8LEVCVyatnbc11TCpvIBpnSaO1eHG8USpqNCqCtgTOuyY5jgec8LHw/+wbqhjmL6TUq7KnIPvAlxcHoNexGZ/uDca3iuJHH5EgDx67kOudNJnOOl57Iii+xf/gmB7MBnG+yS74A2jPzuTvmebQAAAAASUVORK5CYII=";
    }
    if (+currentHour >= 12 &&  +currentHour < 17 && localStorage.getItem("mulberry") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABrUlEQVR4nO1WQVLCQBAMHjzDVX9ieZWD4HcETqliRtGv+ATKzFBEX+Ab8AHqxVNbO4spQoBkJSk80FV7yOxspne2Z3aj6IgAQPkVwml0KEAZbjQbJI5PoOM+0kmnMCecQmhesKeTDoR7bu3+BHTct50KvUHjdqm/BXe+bg339ieQrvxwdndV6p9QN4RwNRIat11wAC37nvENhBVKXzaExGXK5oCW+dYVfB0Quv8VX3EQR00Cbuc+2DeEbjGNz2wID8xmcz4TzRAQl3YT16AwpzRckkvqazJqwbJGA+FPs03js4K/y4QX30dme4pPofwIoffghgVX4/6H80oEnvm8QEDpIdPHhn4RDJjaTWzDwpzyaP0IoLwwW0IXewfPNSUTHA0t7X7no0yEK80nI6B0GdUFKPHWMhSmnK/wZHvJ5tal5Y0ooW7WiHwmEtOE10Wyqe2aCD2JxW4CO/SBwFZcOxB4GTVzHSfj603BNz1IcrVf5fyraCDkQZKr/coE/tgjoPSyvrj22g9FI7UfglztH+LBitXaXx5PqTCbJooyYdZxUe3CUZj4j8I8ItqCH+KDzKkAl9u/AAAAAElFTkSuQmCC";
    }
    if (+currentHour >= 12 &&  +currentHour < 17 && localStorage.getItem("mint") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABXElEQVR4nO2WQU7DMBBFXRasm224CWJLF6Rch7ZrKgqHKpUSOAFnKAegbLp6aMggucZR7WADizwpUjszyXw7MxMbMxAB8Aw05q9AyZ3kBJgChcfXALXHXgCV3JtCwFQX+gKMA+ILjRWqFAIK64GXAfGTGMGhIsaSHBjp/2tgA7zr9Sg7pb6RxqZJ7gLc0c3S5IR25cIeuAFKvWZq42sncgnYaJKZxzdX3zrlkMEeNMDu0wKlJ152QnizbKfAA/AaPbBoexy7z48IOPMIuFfbwXN6Q1vtwtzjW7ivANiq7fzHyZ2htNd3XurKF1YRVh4BFyYVwJJubp3YFWE0IYNoYg0i2Ym11sROf38bu1qEK2snuqiTjeLkEPkxyvU5vvIl9x1InN4Ppd+hBsWx2b0fSr8ZATy5Nyfv/Viy9H4MTu///oGVw96vAwszr1COF2adW8B2KEz+W2EOmA4+AIIYfW0sxx8BAAAAAElFTkSuQmCC";
    }
    if (+currentHour >= 12 &&  +currentHour < 17 && localStorage.getItem("bubblegum") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABvElEQVR4nO1Wy04CMRStLlzjVv/EuNWFwpIw55IwfyGwmoXGx0cJCegXyLatmOgHiBtXNXfskKEZYCoddcFJbgLtnd7TzrlnKsQWHlBEj5poLP4KmshwVFrEJMmuJKpPifYLCIw1MHLHOfc5is752Y0JSKJ6ulPgScdxbV0+F09ziQyT2JjANLegjKKTdfmq3T71IVwKOo5rXNwIscP/JdBQwFABHzYGfFI8xzmcG6y4CwVcZ+JzQxFdiSohgYYt9qmILqZRdMChiLo8lr4mexKVQAFDu9OuO6eBnp27D2kyJm80mmjGY7xrN5/HrPjes7FJs7mngTsFvHkbluYe/15wVIbAS6dz6BLQRLdzjRT4hTcUMLCL9QoI991XoIheUz9otY5ECMjMlFhwQI9Pwu68n4kwbz4ZAQkcByHA4FZb1oYauBQ5KKKbpbmLsVofOo5r7HBzIyKq81FbTcz4d5HtsgiZRHYSK4iPgllxcEjPj1FwmCTZ1cBZUfGiC4nT+yaIBnwuJAu9XzZ+6hEKeHAfDt77vqik933g9P7vX1gn+d63r6eEMKslqtcJM8SHahW2wlT/UZhbiCX4AhRWJcchFGSoAAAAAElFTkSuQmCC";
    }
    if (+currentHour >= 17 &&  +currentHour <= 23 && localStorage.getItem("mulberry") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABfUlEQVR4nO3Vu0oDURAG4KCCIFpYesNOfAxLLbQQ8QW0UhEErRd2JopYBe0UrLRIp0IENTMJ+g5iYeGtFiNYSJJfzkrQYDbZjXuWFBmYcvl2fs45k0i0q9UKF84grrf64wOveAhKR1C6hzpd8aDZ5DyEClAGhHfiQdVdg1DZQ72mybgmLf+gDBO5XTTPAxB+rUJNZ1LddmHh4z+o6ZvtPrtXRuizJny5OWYPVt6oido+XBDK+MJCu/ZgpQd/mB+RTnfagYU+/KP2pl6wBRfqwkrPVk43lO7qw97Umcgjh/B5Q/h78hQcpyM6WHklGOz1SWSxI08jUCqGwF+gvBhJ9FA+CAFXrtoTlPeQ4ylochzq9OLU6UGWRpHjaShNBFv8DU93qH4ziyfY1N6fh4rc7waUoe5cuMiFVyFcah7lEoSXQqGVQtadaSp2s8+z7mwiglW5Hyx6KkLo0NyOf6G/C+oMQ2jZe7mEbiH87r3tZnkIn0Fp3fxk1UftaoX6AjkTIQsmyL2eAAAAAElFTkSuQmCC";
    }
    if (+currentHour >= 17 &&  +currentHour <= 23 && localStorage.getItem("mint")=== "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABGklEQVR4nO3VTytEURzG8QmlxMKSITt5GZZmwULyBlghpXgVVmJHWbGXGi9FFhb+rWWUhZiPTkZM3Jl7zT23Wcx3fU7fc55+5zylUo9uA+MYLVJYxgmuMVCUdBk1n+wWJd1C3TdzRd20rplybOkYHv1mMLb41N+MxH4yrwni6ZjinQRp3OFCtYV4P6b4poX4Fv2xxC9asxJLXGsjvo8y3bjSnmrukeNCOvbQl6d4Q3rOcosdk3jLIH/Aai7R40h27nCACmYwjCFMYR6zaYu/3XRn4SkUT9pbVzJGnkSo1qWskW/ivQNp2LuWSfoFFv4Ze+jzxVIOVXmYMvqw5ji8jo6kP8EE1hs/1yWeG397KI9zbIdDNm3q0Q18AGTq331UfcmSAAAAAElFTkSuQmCC";
    }
    if (+currentHour >= 17 &&  +currentHour <= 23 && localStorage.getItem("bubblegum") === "true") {
        timeIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO3Vv0oDQRAG8EMFQbSw9B924lvEMhZaiDH3fQspoqRQEQSt8wBWop2ClfYixNKXEILKzSbR1KKChWhOVhMMklwu8TZYZGC6O347c3szjtOL/xZF1x0vkqNdA0up1IQAp0J6V7HYQFdQcd0VDTxr0tfAXldQTW4LWflCTbpuvCuVSj1K+qblVtGCUmMCPNajJm/j8UGrsJBnv1GT+XR6xOovo4G3RrCXTM5YgwXYbYRav1wC5JrC5IE1WAPFALjkJxL9VmAhXwNgv0CuWoF1bUo1SQEerNxuTd4EwVU8F3nLhbxsBVfn9r6fzfZFBnvAZij4Gz+PrO13yeSUkO9hcSHLHrAWSesFOA5d9U/19wIcanJeA7PXicRwOZMZEnLaAxa0UnMtYbOFWt3uNg/1ZBZPqKrNydtpecCnqHhKLbfXcnJLgI+OUfMusN4WWgtRarGTtlf3+ZLz51VJHoVpvXlGgBPzdzhRxa1SkwVyw0wuIfOafKnO9pIGLoTcMYeMDOyFE1F8AgWUb6nSfKHUAAAAAElFTkSuQmCC";
    } 
    
    timeIcon.style.transition = "all .1s ease";

    
}, 300)
    


// Makes sure that the color theme picked by user persists after refresh
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