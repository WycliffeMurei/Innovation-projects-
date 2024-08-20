// Element Selectors
const selectors = {
    currentLocation: '.location .data',
    dateAndTime: '.date-and-time .data',
    temperature: '.temperature .data',
    condition: '.condition .data',
    imgIcon: '.icon .data',
    windSpeed: '.wind-speed .data',
    pressure: '.pressure .data',
    precipitation: '.precipitation .data',
    humidity: '.humidity .data',
    cloud: '.cloud .data',
    feelsLike: '.feels-like .data',
    visibility: '.visibility .data',
    uvIndex: '.uv-index .data',
    searchForm: 'form',
    searchInput: 'form input',
    toggleTemperatureUnit: '.toggle-temperature-unit'
  }
  
  const API_KEY = '2d19ef53f41a4aeda35133045241607'
  
  // State
  let isCelsius = true
  let currentWeatherData
  
  // DOM Elements
  const elements = {}
  Object.keys(selectors).forEach((key) => {
    elements[key] = document.querySelector(selectors[key])
  })
  
  // Event Listeners
  elements.toggleTemperatureUnit.addEventListener('click', toggleTemperatureUnit)
  elements.searchForm.addEventListener('submit', handleSearchFormSubmit)
  
  // Function Definitions
  function toggleTemperatureUnit () {
    isCelsius = !isCelsius
    if (currentWeatherData) {
      updateTemperatureDisplay(currentWeatherData)
    }
  
    // Update the temperature unit
    const tempIcon = elements.toggleTemperatureUnit
    if (isCelsius) {
      tempIcon.textContent = '°F'
      tempIcon.title = 'Display in °F'
    } else {
      tempIcon.textContent = '°C'
      tempIcon.title = 'Display in °C'
    }
  }
  
  function clearSearchInput () {
    elements.searchInput.value = ''
  }
  
  function getCityName () {
    return elements.searchInput.value.trim().toLowerCase()
  }
  
  function processWeatherData (data) {
    const { location, current } = data
    return {
      city: location.name,
      region: location.region,
      country: location.country,
      lastUpdated: current.last_updated,
      tempC: current.temp_c,
      tempF: current.temp_f,
      condition: current.condition.text,
      icon: current.condition.icon,
      windKph: current.wind_kph,
      pressureMb: current.pressure_mb,
      precipMm: current.precip_mm,
      humidity: current.humidity,
      cloud: current.cloud,
      feelsLikeC: current.feelslike_c,
      feelsLikeF: current.feelslike_f,
      visibilityKm: current.vis_km,
      uv: current.uv
    }
  }
  
  function reformatDateTime (dateTimeStr) {
    const date = dateFns.parseISO(dateTimeStr)
    const formattedDate = dateFns.format(date, 'do MMMM, yyyy')
    const formattedTime = dateFns.format(date, 'h:mm a')
    return `${formattedDate} As of <b>${formattedTime}</b>`
  }
  
  function updateTemperatureDisplay (data) {
    elements.temperature.textContent = isCelsius
      ? `${data.tempC}°C`
      : `${data.tempF}°F`
    elements.feelsLike.textContent = isCelsius
      ? `${data.feelsLikeC}°C`
      : `${data.feelsLikeF}°F`
  }
  
  function displayWeatherInformation (data) {
    elements.currentLocation.textContent = `${data.city}, ${data.region}, ${data.country}`
    elements.dateAndTime.innerHTML = reformatDateTime(data.lastUpdated)
    updateTemperatureDisplay(data)
    elements.condition.textContent = data.condition
    elements.imgIcon.src = data.icon
    elements.windSpeed.textContent = `${data.windKph} km/h`
    elements.pressure.textContent = `${data.pressureMb} mb`
    elements.precipitation.textContent = `${data.precipMm} mm`
    elements.humidity.textContent = data.humidity
    elements.cloud.textContent = data.cloud
    elements.visibility.textContent = `${data.visibilityKm} km`
    elements.uvIndex.textContent = data.uv
  }
  
  async function fetchWeatherData (cityName) {

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`
    const response = await fetch(url, { mode: 'cors' })
    return response.json()
  }
  
  async function fetchAndDisplayWeatherData (cityName) {
    try {
      const data = await fetchWeatherData(cityName)
      const processedData = processWeatherData(data)
      currentWeatherData = processedData
      displayWeatherInformation(processedData)
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
    }
  }
  
  async function handleSearchFormSubmit (event) {
    event.preventDefault()
    const cityName = getCityName()
    if (cityName) {
      fetchAndDisplayWeatherData(cityName)
    }
    clearSearchInput()
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const defaultCityName = 'Nairobi'
    fetchAndDisplayWeatherData(defaultCityName)
  })
  