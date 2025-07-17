// services/weatherService.ts

const API_KEY = '32217237116234f754eec5fc5460d012'; // 🔐 Replace with your real key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      uvIndex: await fetchUVIndex(lat, lon),
      location: data.name,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};

const fetchUVIndex = async (lat: number, lon: number): Promise<number> => {
  try {
    const response = await fetch(
      `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Failed to fetch UV index:', error);
    return -1;
  }
};
