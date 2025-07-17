// context/UserPreferencesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type TemperatureUnit = 'C' | 'F';

interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  alertsEnabled: boolean;
  vibrationEnabled: boolean;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setAlertsEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
}

const defaultValues: UserPreferences = {
  temperatureUnit: 'C',
  alertsEnabled: true,
  vibrationEnabled: true,
  setTemperatureUnit: () => {},
  setAlertsEnabled: () => {},
  setVibrationEnabled: () => {},
};

const UserPreferencesContext = createContext<UserPreferences>(defaultValues);

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <UserPreferencesContext.Provider
      value={{
        temperatureUnit,
        alertsEnabled,
        vibrationEnabled,
        setTemperatureUnit,
        setAlertsEnabled,
        setVibrationEnabled,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
