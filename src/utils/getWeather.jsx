import axios from "axios";
async function getWeather(city) {
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&APPID=${apiKey}&units=metric`;
    console.log(apiUrl);
    
    try {
      const response = await axios.get(apiUrl);
      console.log("response", response);
      
      const data = response.data;
      const weatherDescription = data.weather[0].description;
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const weatherInfo = `The weather in ${city} is currently ${weatherDescription} with a temperature of ${temp}°C and humidity of ${humidity}%.`;
      console.log(weatherInfo);
      
  
      return weatherInfo;
    } catch (error) {
      // console.error("Error fetching weather data", error);
      // return "Sorry, I couldn't fetch the weather information.";
      console.error("Error fetching weather data:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        return `Sorry, I couldn't find weather data for "${city}". Please check the city name and try again.`;
      }
      return "Sorry, I couldn't fetch the weather information. Please try again later.";
    }
  }

  export default getWeather;
  
  