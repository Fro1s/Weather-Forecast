const api = {
    key: "e9c18583c21cbce3d59bf86dea1bb62c",
    base: "https://api.openweathermap.org/data/2.5/weather?",
    lang: "pt_br",
    units: "metric",
};

const city = document.querySelector(".city");
let date = document.querySelector(".date");
const container_img = document.querySelector(".container-img");
const container_temp = document.querySelector(".container-temp");
const temp_number = document.querySelector(".container-temp div");
const temp_unit = document.querySelector(".container-temp span");
const weather_t = document.querySelector(".weather");
const min_max = document.querySelector(".min-max");
const input = document.querySelector(".form-control");
const button = document.querySelector(".btn");

function searchResults(city) {
    fetch(
        `${api.base}q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error(`http error: status ${res.status}`);
            }
            return res.json();
        })
        .catch((error) => {
            alert(error.message);
        })
        .then((res) => {
            displayResults(res);
        });
}

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        alert("navigator dont supports geological");
    }
    function setPosition(position) {
        console.log(position);
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`error: ${error.message}`);
    }
});

function coordResults(lat, long) {
    fetch(
        `${api.base}lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            alert(error.message);
        })
        .then((response) => {
            displayResults(response);
        });
}

function displayResults(weather) {
    console.log(weather);

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date = document.getElementById("Date");
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./GifWeather/${iconName}.png" alt="Imagens Tempo"/>`;

    temp_number.innerHTML = `${Math.round(weather.main.temp)}`;
    temp_unit.innerHTML = `°C`;

    weather_temp = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_temp);

    min_max.innerHTML = `${Math.round(weather.main.temp_min)}°C / ${Math.round(
        weather.main.temp_max
    )}°C`;
}

button.addEventListener("click", function () {
    searchResults(input.value);
});

input.addEventListener("keypress", enter);
{
    function enter(event) {
        key = event.keyCode;
        if (key === 13) {
            searchResults(input.value);
        }
    }
}

function dateBuilder(d) {
    let months = [
        "de Janeiro de",
        "de Fevereiro de",
        "de Março de",
        "de Abril de",
        "de Maio de",
        "de Junho de",
        "de Julho de",
        "de Agosto de",
        "de Setembro de",
        "de Outubro de",
        "de Novembro de",
        "de Dezembro de",
    ];
    let days = [
        "Domingo,",
        "Segunda,",
        "Terça,",
        "Quarta,",
        "Quinta,",
        "Sexta,",
        "Sábado,",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

container_temp.addEventListener("click", changeTemp);
function changeTemp() {
    temp_number_now = temp_number.innerHTML;

    if (temp_unit.innerHTML === "°C") {
        let f = temp_number_now * 1.8 + 32;
        temp_unit.innerHTML = "°F";
        temp_number.innerHTML = Math.round(f);
    } else {
        let c = (temp_number_now - 32) / 1.8;
        temp_unit.innerHTML = "°C";
        temp_number.innerHTML = Math.round(c);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}