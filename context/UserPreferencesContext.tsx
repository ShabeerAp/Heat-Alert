import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedLocation, AlertSettings, AppSettings } from "@/types/preferences";

const STORAGE_KEYS = {
  LOCATIONS: "heat_alert_locations",
  USER_LOCATION: "heat_alert_user_location",
  ALERT_SETTINGS: "heat_alert_alert_settings",
  APP_SETTINGS: "heat_alert_app_settings",
  USER_EMAIL: "heat_alert_user_email",
};

const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  heatIndexEnabled: true,
  heatIndexThreshold: 90,
  temperatureEnabled: false,
  temperatureThreshold: 95,
  dailyForecastEnabled: false,
};

const DEFAULT_APP_SETTINGS: AppSettings = {
  useCelsius: false,
  autoRefresh: true,
  backgroundUpdates: true,
};

export const [UserPreferencesProvider, useUserPreferences] = createContextHook(() => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(DEFAULT_ALERT_SETTINGS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load saved data from AsyncStorage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load saved locations
        const locationsJson = await AsyncStorage.getItem(STORAGE_KEYS.LOCATIONS);
        if (locationsJson) {
          setSavedLocations(JSON.parse(locationsJson));
        }

        // Load user location
        const userLocationJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
        if (userLocationJson) {
          setUserLocation(JSON.parse(userLocationJson));
        }

        // Load alert settings
        const alertSettingsJson = await AsyncStorage.getItem(STORAGE_KEYS.ALERT_SETTINGS);
        if (alertSettingsJson) {
          setAlertSettings(JSON.parse(alertSettingsJson));
        }

        // Load app settings
        const appSettingsJson = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
        if (appSettingsJson) {
          setSettings(JSON.parse(appSettingsJson));
        }

        // Load user email
        const email = await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
        if (email) {
          setUserEmail(email);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadSavedData();
  }, []);

  // Save locations to AsyncStorage when they change
  useEffect(() => {
    const saveLocations = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(savedLocations));
      } catch (error) {
        console.error("Error saving locations:", error);
      }
    };

    saveLocations();
  }, [savedLocations]);

  // Save user location to AsyncStorage when it changes
  useEffect(() => {
    const saveUserLocation = async () => {
      try {
        if (userLocation) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(userLocation));
        } else {
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_LOCATION);
        }
      } catch (error) {
        console.error("Error saving user location:", error);
      }
    };

    saveUserLocation();
  }, [userLocation]);

  // Save alert settings to AsyncStorage when they change
  useEffect(() => {
    const saveAlertSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.ALERT_SETTINGS, JSON.stringify(alertSettings));
      } catch (error) {
        console.error("Error saving alert settings:", error);
      }
    };

    saveAlertSettings();
  }, [alertSettings]);

  // Save app settings to AsyncStorage when they change
  useEffect(() => {
    const saveAppSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
      } catch (error) {
        console.error("Error saving app settings:", error);
      }
    };

    saveAppSettings();
  }, [settings]);

  // Save user email to AsyncStorage when it changes
  useEffect(() => {
    const saveUserEmail = async () => {
      try {
        if (userEmail) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, userEmail);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        }
      } catch (error) {
        console.error("Error saving user email:", error);
      }
    };

    saveUserEmail();
  }, [userEmail]);

  const addLocation = (location: SavedLocation) => {
    // Check if location already exists
    const exists = savedLocations.some(loc => loc.id === location.id);
    if (!exists) {
      setSavedLocations([...savedLocations, location]);
    }
  };

  const removeLocation = (locationId: string) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== locationId));
  };

  const updateAlertSettings = (newSettings: AlertSettings) => {
    setAlertSettings(newSettings);
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const clearAllData = async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LOCATIONS,
        STORAGE_KEYS.USER_LOCATION,
        STORAGE_KEYS.ALERT_SETTINGS,
        STORAGE_KEYS.APP_SETTINGS,
        STORAGE_KEYS.USER_EMAIL,
      ]);

      // Reset state
      setSavedLocations([]);
      setUserLocation(null);
      setAlertSettings(DEFAULT_ALERT_SETTINGS);
      setSettings(DEFAULT_APP_SETTINGS);
      setUserEmail(null);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return {
    savedLocations,
    userLocation,
    alertSettings,
    settings,
    userEmail,
    addLocation,
    removeLocation,
    setUserLocation,
    updateAlertSettings,
    updateSettings,
    setUserEmail,
    clearAllData,
  };
});
