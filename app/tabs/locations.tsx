import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, Alert } from "react-native";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { useWeather } from "@/context/WeatherContext";
import { MapPin, Plus, X, Navigation } from "lucide-react-native";
import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function LocationsScreen() {
  const { savedLocations, addLocation, removeLocation, setUserLocation } = useUserPreferences();
  const { searchLocations, isLoading } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert("Search Error", "Unable to search locations. Please try again.");
    }
  };

  const handleAddLocation = (location: any) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    addLocation({
      id: location.id.toString(),
      name: location.name,
      country: location.sys.country,
      latitude: location.coord.lat,
      longitude: location.coord.lon
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleRemoveLocation = (locationId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Remove Location",
      "Are you sure you want to remove this location?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeLocation(locationId) }
      ]
    );
  };

  const handleSelectLocation = (location: any) => {
    setUserLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name
    });
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    Alert.alert(
      "Location Selected",
      `Weather data for ${location.name} will be displayed on the home screen.`,
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundDark, Colors.backgroundLight]}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#aaa"
        />
        <Pressable 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <View style={styles.locationInfo}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={styles.locationName}>{item.name}, {item.sys.country}</Text>
                </View>
                <Pressable
                  style={styles.addButton}
                  onPress={() => handleAddLocation(item)}
                >
                  <Plus size={20} color="#fff" />
                </Pressable>
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.savedLocationsContainer}>
        <Text style={styles.sectionTitle}>Saved Locations</Text>
        {savedLocations.length === 0 ? (
          <Text style={styles.noLocationsText}>
            No saved locations. Search for a city to add it to your list.
          </Text>
        ) : (
          <FlatList
            data={savedLocations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.savedLocationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.locationInfo}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={styles.locationName}>{item.name}, {item.country}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable
                    style={styles.selectButton}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Navigation size={20} color="#fff" />
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveLocation(item.id)}
                  >
                    <X size={20} color="#fff" />
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  resultItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationName: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  savedLocationsContainer: {
    flex: 1,
  },
  savedLocationItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  selectButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: Colors.danger,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  noLocationsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
});
