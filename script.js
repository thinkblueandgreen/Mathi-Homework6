function buildQueryURL() {
    var citySelected = $("#search-term").val().trim();
    localStorage.setItem("selectedCity", citySelected);
    console.log(citySelected);
    var fiveDayForecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySelected + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    console.log("In buildQueryURL: " + fiveDayForecastQueryURL);
    return fiveDayForecastQueryURL;
}

function weatherQueryURL(citySelected) {
    console.log(citySelected);
    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySelected + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    console.log("In buildQueryURL: " + weatherQueryURL);
    return weatherQueryURL;
}

function currentWeather(currentQueryURL, currentDate) {
    //For current weather
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
    console.log(response);
    $(".city").html("<h1>" + response.name + "</h1>");
    $(".today").text(currentDate);
    //weather logo
    var iconcode = response.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $('#wicon').attr('src', iconurl);

    $(".temp").text("Temperature: " + response.main.temp + "F");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".wind").text("Wind Speed: " + response.wind.speed);
    $(".UVIndex").html("UV Index: " + "<button class = 'btn-danger' style='height:20px' >" + "</button>");
    });
}

function forecast(queryURL) {
    //For forecast weather
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
    console.log(response);
    $("#forecastCardsDisplay").html("");

    for (i = 0; i < 5; i++) {
        var newDate = new Date(Date.now() + (1+i) * 24 * 60 * 60 * 1000);
        var formatedNewDate = newDate.toLocaleDateString();
       
        var cardDate = $("<h5>").text(formatedNewDate);

        //forcast logo
        var forecastCode = response.list[i].weather[0].icon;
        var forecastLogo = $("<img>")
        forecastLogo.attr('src', 'http://openweathermap.org/img/w/' + forecastCode + '.png');
        forecastLogo.css({"height" : "50px", "width" : "50px"})

        var cardTemp = $("<p>").text("Temp: " + response.list[i].main.temp);
        var cardHumidity = $("<p>").text("Humidity: " + response.list[i].main.humidity); 

        var forecastCardEl = $("<div>")
        forecastCardEl.addClass("col-md-2 card text-white bg-primary")
        forecastCardEl.css({"margin" : "10px"})
        forecastCardEl.append(cardDate);
        forecastCardEl.append(forecastLogo);
        forecastCardEl.append(cardTemp);
        forecastCardEl.append(cardHumidity);

        $("#forecastCardsDisplay").append(forecastCardEl)            
     };
    });
}

$("#run-search").on("click", function (event) {
    event.preventDefault();
    //city name
    var citySelected = $("#search-term").val().trim();

    //building current weather queryURL
    var currentQueryURL = weatherQueryURL(citySelected);
    console.log("After click buildQueryURL: " + weatherQueryURL());
    //current date
    var d = new Date()
    var currentDate = d.toLocaleDateString()
    console.log(currentDate)
    //For current weather display
    currentWeather(currentQueryURL, currentDate);

    //building forecast queryURL
    var queryURL = buildQueryURL();
    console.log("After click buildQueryURL: " + buildQueryURL());
    //forecast days are calcualted in the function  
    //For forecast display 
    forecast (queryURL);
});


// A $( document ).ready() block - Getting selected city from local storage
$(document).ready(function() {
    console.log( "ready!" );

    var preSelectedCityFromLocalStorage = localStorage.getItem("selectedCity");
        if(preSelectedCityFromLocalStorage != null) {
            console.log("selectedCity: "+preSelectedCityFromLocalStorage);
        } else {
            return;
        }

    //For current weather display
    var currentQueryURL = weatherQueryURL(preSelectedCityFromLocalStorage);
    var d = new Date()
    var currentDate = d.toLocaleDateString()
    console.log(currentDate)

    //For current weather
    currentWeather(currentQueryURL, currentDate);
    
    //For forecast display 
    var queryURL = buildQueryURL();
    forecast(queryURL)   
    
});
