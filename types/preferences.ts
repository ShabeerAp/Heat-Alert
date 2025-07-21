export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AlertSettings {
  heatIndexEnabled: boolean;
  heatIndexThreshold: number;
  temperatureEnabled: boolean;
  temperatureThreshold: number;
  dailyForecastEnabled: boolean;
}

export interface AppSettings {
  useCelsius: boolean;
  autoRefresh: boolean;
  backgroundUpdates: boolean;
}
