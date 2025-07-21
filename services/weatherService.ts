import { WeatherData, LocationSearchResult } from "@/types/weather";

const API_KEY = "32217237116234f754eec5fc5460d012"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function searchLocationsByName(query: string): Promise<LocationSearchResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/find?q=${encodeURIComponent(query)}&units=imperial&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Location search API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.list || [];
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

// Mock function for email alerts - in a real app, this would connect to a backend service
export async function sendHeatAlert(
  email: string,
  location: string,
  heatIndex: number,
  message: string
): Promise<boolean> {
  // This is a mock function that would normally connect to a backend
  console.log(`Sending heat alert to ${email} for ${location}: ${message}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
