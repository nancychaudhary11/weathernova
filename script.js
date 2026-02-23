const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelslike = document.querySelector(".feelslike"),
    weatherDescription = document.querySelector(".weatherDescription"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),

    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    RValue = document.getElementById("RValue"),
    PValue = document.getElementById("PValue"),
    Forecast = document.querySelector(".Forecast");

function clearWeatherData() {

    city.innerHTML = "";
    temperature.innerHTML = "";
    feelslike.innerHTML = "";
    weatherDescription.innerHTML = "";
    date.innerHTML = "";
    weatherIcon.style.background = "";

    HValue.innerHTML = "";
    WValue.innerHTML = "";
    PValue.innerHTML = "";
    CValue.innerHTML = "";
    RValue.innerHTML = "";
    SRValue.innerHTML = "";
    SSValue.innerHTML = "";

    Forecast.innerHTML = "";
}



const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&units=metric&q=`;
const FORECAST_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?appid=a5bb4718b30b6f58f58697997567fffa&units=metric&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&exclude=minutely&units=metric&`;


function findUserLocation() {
    if (userLocation.value.trim() === "") {
        alert("Please enter a city name.");
        return;
    }
    clearWeatherData();

    Forecast.innerHTML = " ";
    //alert(1);  // will show alert when no city entered.
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {

            if (data.cod !== 200) {
                clearWeatherData();
                alert("City not found!");
                return;
            }
            console.log(data);

            city.innerHTML = data.name + " , " + data.sys.country;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) center/contain no-repeat`;


            fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);


                    temperature.innerHTML = TemConverter(data.main.temp);
                    feelslike.innerHTML = "Feels like: " + data.main.feels_like + "°C";
                    weatherDescription.innerHTML =
                        `<i class="fa-solid fa-cloud"></i> &nbsp; ${data.weather[0].description}`;

                    const now = new Date();

                    const options = {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                    };

                    date.innerHTML = now.toLocaleString("en-US", options);


                    HValue.innerHTML = data.main.humidity + "%";
                    WValue.innerHTML = data.wind.speed + " m/s";
                    PValue.innerHTML = data.main.pressure + " hPa";
                    CValue.innerHTML = data.clouds.all + "%";
                    const rain = data.rain?.["1h"] || 0;
                    const snow = data.snow?.["1h"] || 0;
                    RValue.innerHTML = (rain + snow) + " mm";

                    SRValue.innerHTML = new Date(data.sys.sunrise * 1000)
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    SSValue.innerHTML =
                        new Date(data.sys.sunset * 1000)
                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    /* SRValue.innerHTML =
                         new Date(data.sys.sunrise * 1000).toLocaleTimeString();
         
                     SSValue.innerHTML =
                         new Date(data.sys.sunset * 1000).toLocaleTimeString(); */



                    fetch(FORECAST_ENDPOINT + userLocation.value)
                        .then((response) => response.json())
                        .then((forecastData) => {

                            Forecast.innerHTML = "";

                            for (let i = 0; i < forecastData.list.length; i += 8) {

                                const item = forecastData.list[i];

                                let div = document.createElement("div");
                                div.classList.add("forecast-item");

                                div.innerHTML = `
                <p>${new Date(item.dt * 1000).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric"
                                })}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
                <p>${TemConverter(item.main.temp)}</p>
                <p class="forecast-desc">${item.weather[0].description}</p>`;

                                Forecast.appendChild(div);
                            }
                        });

                    if (data.weather[0].main === "Clear") {
                        document.querySelector(".weather-input").style.background =
                            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('clear.jpg')";
                    }

                    if (data.weather[0].main === "Rain") {
                        document.querySelector(".weather-input").style.background =
                            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('rain.jpg')";
                    }


                });

            function TemConverter(temp) {
                let tempValue = Math.round(temp);
                let message = "";
                if (converter.value == "°C") {
                    message = tempValue + "<span>°C</span>";
                }
                else {
                    let ctof = Math.round((tempValue * 9) / 5 + 32);
                    message = ctof + "<span>°F</span>";
                } return message;

            }
            converter.addEventListener("change", () => {
                if (userLocation.value !== "") {
                    findUserLocation();
                }
            });





        });

}

// DARK / LIGHT MODE 

document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("themeToggle");
    const modeText = document.querySelector(".mode-text");

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        toggle.checked = true;
        modeText.textContent = "Light Mode";
    }

    toggle.addEventListener("change", () => {

        if (toggle.checked) {
            document.body.classList.add("dark");
            modeText.textContent = "Light Mode";
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            modeText.textContent = "Dark Mode";
            localStorage.setItem("theme", "light");
        }

    });

});









