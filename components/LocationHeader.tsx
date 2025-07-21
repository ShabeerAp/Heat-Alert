import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { MapPin, RefreshCw } from "lucide-react-native";
import { useWeather } from "@/context/WeatherContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface LocationHeaderProps {
  locationName: string;
}

export default function LocationHeader({ locationName }: LocationHeaderProps) {
  const { refreshWeather, isLoading } = useWeather();
  const { userLocation } = useUserPreferences();

  const handleRefresh = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (userLocation) {
      refreshWeather(userLocation.latitude, userLocation.longitude);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <MapPin size={20} color="#fff" />
        <Text style={styles.locationText}>{locationName}</Text>
      </View>
      
      <Pressable 
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={isLoading}
      >
        <RefreshCw 
          size={20} 
          color="#fff" 
          style={isLoading ? styles.rotating : undefined}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
});
