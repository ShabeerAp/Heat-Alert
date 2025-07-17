// context/WeatherContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeatherData } from '../types/weather';

interface WeatherContextType {
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData) => void;
  location: string;
  setLocation: (loc: string) => void;
}

const defaultValues: WeatherContextType = {
  weatherData: null,
  setWeatherData: () => {},
  location: 'Your City',
  setLocation: () => {},
};

const WeatherContext = createContext<WeatherContextType>(defaultValues);

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>('Your City');

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        location,
        setLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
