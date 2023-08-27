
 /* Recent Weather*/
$(document).ready(function() {
  const MAX_RECENT_CITIES = 10;
  const localStorageKey = 'recentCities';
  const recentCities = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  populateRecentCities(recentCities);

  $('#search-form').submit(function(event) {
    event.preventDefault();
    const city = $('#city-input').val();
    console.log(city);
    fetchWeather(city);

    if (!$('#city-list li:contains(' + city + ')').length) {
      updateRecentCities(city);

      if ($('#city-list li').length > MAX_RECENT_CITIES) {
        $('#city-list li:last-child').remove();
      }
    }

    updateLocalStorage(city, recentCities);
  });

  $('#city-list').on('click', 'li', function() {
    const city = $(this).text();
    fetchWeather(city);
  });

  $('#clear-recent').click(function() {
    $('#city-list').empty();
    $(this).hide();
    localStorage.removeItem(localStorageKey);
  });

  function updateLocalStorage(city, recentCities) {
    if (!recentCities.includes(city)) {
      recentCities.unshift(city);
      if (recentCities.length > MAX_RECENT_CITIES) {
        recentCities.pop();
      }
      localStorage.setItem(localStorageKey, JSON.stringify(recentCities));
    }
  }

  function populateRecentCities(recentCities) {
    const $cityList = $('#city-list');
    recentCities.forEach(city => {
      const $cityItem = $('<li>').text(city).addClass('clickable');
      $cityList.append($cityItem);
    });
    const $clearButton = $('#clear-recent');
    if (recentCities.length > 0) {
      $clearButton.show();
    } else {
      $clearButton.hide();
    }
  }

  function updateRecentCities(city) {
    const $cityList = $('#city-list');
    const $newCityItem = $('<li>').text(city);
    $cityList.prepend($newCityItem);
    $('#clear-recent').show(); 
  }

  /* Current Weather*/

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

});
