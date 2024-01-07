const d = document;

const $app = d.querySelector(".weather-app"),
  $temp = d.querySelector(".temp"),
  $dateOutput = d.querySelector(".date"),
  $timeOutput = d.querySelector(".time"),
  $conditionOutput = d.querySelector(".condition"),
  $nameOutput = d.querySelector(".name"),
  $icon = d.querySelector(".icon"),
  $cloudOutput = d.querySelector(".cloud"),
  $humidityOutput = d.querySelector(".humidity"),
  $windOutput = d.querySelector(".wind"),
  $form = d.getElementById("location-input"),
  $search = d.querySelector(".search"),
  $btn = d.querySelector(".submit"),
  $cities = d.querySelectorAll(".city");

//Ciudad por defecto cuando carga la página
let cityInput = "Buenos Aires";

//Agrega el evento click a cada ciudad del panel
$cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    //Cambia de la ciudad por defecto a la ciudad clickeada
    cityInput = e.target.innerHTML;
    fetchWeatherData();
  });
});

//Agrega el evento submit al formulario
$form.addEventListener("submit", (e) => {
  e.preventDefault();

  if ($search.value.length === 0) {
    alert("No ingresaste una ciudad");
  } else {
    //Cambia ciudad por defecto por la buscada
    cityInput = $search.value;
    fetchWeatherData();
    $search.value = "";
  }
});

//Función para la fecha
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

//WeatherAPI con Fetch
function fetchWeatherData() {
  const APIKey = "INSERT_API_KEY";
  const lang = "es";

  fetch(
    `http://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${cityInput}&lang=${lang}`
  )
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);

      $temp.innerHTML = json.current.temp_c + "&#176;";
      $conditionOutput.innerHTML = json.current.condition.text;

      /*Para extraer el día, mes y año de la ciudad obtenida
      Importante tener en cuenta que new Date() devuelve primero el mes y luego el día
      */
      const date = json.location.localtime,
        y = parseInt(date.substr(0, 4)),
        m = parseInt(date.substr(8, 2)),
        d = parseInt(date.substr(5, 2)),
        time = date.substr(11);

      //Reformateo de la fecha
      $dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${m}, ${d}, ${y}`;
      $timeOutput.innerHTML = time;
      $nameOutput.innerHTML = `${json.location.name}`;

      //Obtener el ícono correspondiente al clima y extraer el endpoint
      const iconId = json.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      $icon.src = `./icons/${iconId}`;

      //console.log("id: ", iconId);

      //Agregar detalles del clima a la página
      $cloudOutput.innerHTML = `${json.current.cloud} %`;
      $humidityOutput.innerHTML = `${json.current.humidity} %`;
      $windOutput.innerHTML = `${json.current.wind_kph} Km/h`;

      //Tiempo del día por defecto
      let timeOfDay = "dia";

      //Obtener el id para las condiciones climáticas
      const code = json.current.condition.code;

      //Cambiar a la noche si en la ciudad elegida es de noche
      if (json.current.is_day === 0) {
        timeOfDay = "noche";
      }

      //console.log(code);

      if (code === 1000) {
        //Si el tiempo es despejado
        $app.style.backgroundImage = `url(./img/${timeOfDay}/despejado.jpg)`;
        $btn.style.backgroundColor = "#e5ba92";

        if (timeOfDay === "noche") {
          $btn.style.backgroundColor = "#181e27";
        }
      } else if (
        //Si el tiempo es nublado
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1279 ||
        code == 1282
      ) {
        $app.style.backgroundImage = `url(./img/${timeOfDay}/nubes.jpg)`;
        $btn.style.backgroundColor = "#fa6d1b";
        if (timeOfDay === "noche") {
          $btn.style.backgroundColor = "#181e27";
        }
      } else if (
        //Si el tiempo es lluvioso o hay tormentas
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252 ||
        code == 1276
      ) {
        $app.style.backgroundImage = `url(./img/${timeOfDay}/lluvia.jpg)`;
        $btn.style.backgroundColor = "#647d75";
        if (timeOfDay === "noche") {
          $btn.style.backgroundColor = "#325c80";
        }
      } else {
        //Si el tiempo es nevado
        $app.style.backgroundImage = `url(./img/${timeOfDay}/nieve.jpg)`;
        if (timeOfDay === "noche") {
          $btn.style.backgroundColor = "#1b1b1b";
        }
      }
    })
    .catch(() => {
      alert("No se encontró la ubicación, intenta otra vez");
    });
}

fetchWeatherData();
