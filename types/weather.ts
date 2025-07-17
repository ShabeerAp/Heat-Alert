// types/weather.ts

export interface CurrentWeather {
  temperature: number; // actual temperature
  feelsLike: number;
  humidity: number;
  uvIndex: number;
  heatIndex: number;
  condition: string; // e.g., 'Clear', 'Cloudy', 'Rainy'
  icon: string; // icon URL or code
  timestamp: string;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  uvIndex: number;
  heatIndex: number;
  icon: string;
}

export interface LocationWeatherData {
  locationId: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  current: CurrentWeather;
  forecast: DailyForecast[];
  lastUpdated: string;
}
