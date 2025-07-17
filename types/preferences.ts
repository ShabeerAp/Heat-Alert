// types/preferences.ts

export type TemperatureUnit = 'C' | 'F';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AlertSettings {
  heatIndexThreshold: number; // e.g. alert if heat index > 40
  uvThreshold: number; // e.g. alert if UV index > 7
  vibrationEnabled: boolean;
  emailAlerts: boolean;
  pushNotifications: boolean;
}

export interface UserPreferences {
  unit: TemperatureUnit;
  theme: ThemeMode;
  alerts: AlertSettings;
  selectedLocationId: string;
}
