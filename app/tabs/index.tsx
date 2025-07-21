import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useWeather } from "@/context/WeatherContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { LinearGradient } from "expo-linear-gradient";
import { Thermometer, Droplets, Wind, Clock } from "lucide-react-native";
import WeatherCard from "@/components/WeatherCard";
import HeatIndexCard from "@/components/HeatIndexCard";
import LocationHeader from "@/components/LocationHeader";
import { getGradientColors } from "@/utils/weatherUtils";
import * as Location from "expo-location";

export default function HomeScreen() {
  const { currentWeather, fetchWeatherByCoords, isLoading } = useWeather();
  const { userLocation, setUserLocation } = useUserPreferences();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted' && !userLocation) {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            name: 'Current Location'
          });
          fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
        }
      } else {
        // Web fallback
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission(true);
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                name: 'Current Location'
              });
              fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
              setLocationPermission(false);
              // Use default location if permission denied
              fetchWeatherByCoords(40.7128, -74.0060); // New York
            }
          );
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherByCoords(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  const gradientColors = getGradientColors(
    currentWeather?.main?.temp || 0
  );

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <LocationHeader 
          locationName={currentWeather?.name || userLocation?.name || 'Unknown Location'} 
        />
        
        {currentWeather ? (
          <>
            <View style={styles.mainTemp}>
              <Text style={styles.temperature}>
                {Math.round(currentWeather.main.temp)}°
              </Text>
              <Text style={styles.weatherDescription}>
                {currentWeather.weather[0].description}
              </Text>
              <Text style={styles.highLow}>
                H: {Math.round(currentWeather.main.temp_max)}° L: {Math.round(currentWeather.main.temp_min)}°
              </Text>
            </View>

            <HeatIndexCard 
              temperature={currentWeather.main.temp}
              humidity={currentWeather.main.humidity}
            />

            <View style={styles.detailsContainer}>
              <WeatherCard 
                title="Humidity"
                value={`${currentWeather.main.humidity}%`}
                icon={<Droplets size={24} color="#fff" />}
              />
              <WeatherCard 
                title="Wind"
                value={`${Math.round(currentWeather.wind.speed)} mph`}
                icon={<Wind size={24} color="#fff" />}
              />
              <WeatherCard 
                title="Feels Like"
                value={`${Math.round(currentWeather.main.feels_like)}°`}
                icon={<Thermometer size={24} color="#fff" />}
              />
              <WeatherCard 
                title="Updated"
                value={new Date(currentWeather.dt * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                icon={<Clock size={24} color="#fff" />}
              />
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {locationPermission === false 
                ? "Location permission denied. Please enable location services or add a location manually."
                : "No weather data available. Please check your connection or try again later."}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

import Colors from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textDark,
  },
  mainTemp: {
    alignItems: "center",
    marginVertical: 20,
  },
  temperature: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#fff",
  },
  weatherDescription: {
    fontSize: 22,
    color: "#fff",
    textTransform: "capitalize",
    marginTop: 5,
  },
  highLow: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  noDataContainer: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginTop: 20,
  },
  noDataText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
