import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import { fetchWeatherByCoordinates, searchLocationsByName } from "@/services/weatherService";
import { WeatherData, LocationSearchResult } from "@/types/weather";

export const [WeatherProvider, useWeather] = createContextHook(() => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  const weatherQuery = useQuery({
    queryKey: ['weather'],
    queryFn: async () => null,
    enabled: false,
  });

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const data = await fetchWeatherByCoordinates(lat, lon);
      setCurrentWeather(data);
      return data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      Alert.alert(
        "Weather Data Error",
        "Unable to fetch weather data. Please check your connection and try again."
      );
      return null;
    }
  };

  const refreshWeather = async (lat: number, lon: number) => {
    return fetchWeatherByCoords(lat, lon);
  };

  const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
    try {
      return await searchLocationsByName(query);
    } catch (error) {
      console.error("Error searching locations:", error);
      Alert.alert(
        "Location Search Error",
        "Unable to search for locations. Please check your connection and try again."
      );
      return [];
    }
  };

  return {
    currentWeather,
    isLoading: weatherQuery.isLoading,
    fetchWeatherByCoords,
    refreshWeather,
    searchLocations,
  };
});
