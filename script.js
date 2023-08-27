$(document).ready(function() {
    
    $('#search-form').submit(function(event) {
      event.preventDefault(); 
      const city = $('#city-input').val(); 
      fetchWeather(city); 
    });
  });



function fetchWeather(city) {
    const apiKey = 'c87120f4f0057256f6ae9f36ae2b9c6d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  
    $.ajax({
      url: apiUrl,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        const cityName = data.city.name;
        const currentWeather = data.list[0];
        const temperature = currentWeather.main.temp;
        const humidity = currentWeather.main.humidity;
        const windSpeed = currentWeather.wind.speed;
        const weatherIcon = currentWeather.weather[0].icon;
      
        const iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;
      
        const currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString();
  
        const weatherDetails = `
          <h3>${cityName}</h3>
          <p>Date: ${currentDate}</p>
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
          <img src="${iconUrl}" alt="Weather Icon">
        `;
      
        $('#weather-details').html(weatherDetails);
  
      },
      error: function(error) {
        console.error('Error fetching weather data:', error);
      }
    });
  }
  