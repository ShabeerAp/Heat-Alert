import { Slot } from 'expo-router';
import { WeatherProvider } from '../context/WeatherContext';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';

/**
 * Root layout for the Heat Alert app
 * Wraps all routes with global providers
 */
export default function RootLayout() {
  return (
    <UserPreferencesProvider>
      <WeatherProvider>
        <Slot /> {/* Renders the current active route (e.g., tabs/index, tabs/alerts) */}
      </WeatherProvider>
    </UserPreferencesProvider>
  );
}
