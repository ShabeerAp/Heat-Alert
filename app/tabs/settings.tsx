import React from "react";
import { StyleSheet, Text, View, Switch, Pressable, ScrollView, Alert, Linking } from "react-native";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Settings, Sun, Moon, Thermometer, RefreshCw, Info, ExternalLink } from "lucide-react-native";
import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const { 
    settings, 
    updateSettings,
    clearAllData
  } = useUserPreferences();

  const toggleSetting = (setting: keyof typeof settings) => {
    updateSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all saved data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive", 
          onPress: () => {
            clearAllData();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert("Success", "All data has been cleared");
          } 
        }
      ]
    );
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the link");
    });
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundDark, Colors.backgroundLight]}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={24} color="#fff" />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Temperature Units</Text>
              <Text style={styles.settingDescription}>
                {settings.useCelsius ? "Celsius (°C)" : "Fahrenheit (°F)"}
              </Text>
            </View>
            <Switch
              value={settings.useCelsius}
              onValueChange={() => toggleSetting('useCelsius')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={settings.useCelsius ? Colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto Refresh</Text>
              <Text style={styles.settingDescription}>
                Automatically refresh weather data
              </Text>
            </View>
            <Switch
              value={settings.autoRefresh}
              onValueChange={() => toggleSetting('autoRefresh')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={settings.autoRefresh ? Colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Background Updates</Text>
              <Text style={styles.settingDescription}>
                Check for alerts in the background
              </Text>
            </View>
            <Switch
              value={settings.backgroundUpdates}
              onValueChange={() => toggleSetting('backgroundUpdates')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={settings.backgroundUpdates ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={24} color="#fff" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>Heat Alert App</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Stay informed about dangerous heat conditions with real-time alerts and notifications.
            </Text>
          </View>

          <Pressable 
            style={styles.linkItem}
            onPress={() => openWebsite("https://openweathermap.org/")}
          >
            <Text style={styles.linkText}>OpenWeather API</Text>
            <ExternalLink size={18} color={Colors.primary} />
          </Pressable>

          <Pressable 
            style={styles.linkItem}
            onPress={() => openWebsite("https://www.weather.gov/safety/heat-index")}
          >
            <Text style={styles.linkText}>Heat Index Information</Text>
            <ExternalLink size={18} color={Colors.primary} />
          </Pressable>
        </View>

        <View style={styles.dangerSection}>
          <Pressable 
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </Pressable>
          <Text style={styles.dangerDescription}>
            This will remove all your saved locations, preferences, and alert settings.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  aboutItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  aboutDescription: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  linkText: {
    fontSize: 16,
    color: Colors.primary,
  },
  dangerSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: Colors.danger,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dangerDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});
