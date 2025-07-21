import React, { useState } from "react";
import { StyleSheet, Text, View, Switch, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Bell, AlertTriangle, Info, Mail } from "lucide-react-native";
import Colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export default function AlertsScreen() {
  const { 
    alertSettings, 
    updateAlertSettings,
    userEmail,
    setUserEmail,
    savedLocations
  } = useUserPreferences();
  
  const [email, setEmail] = useState(userEmail || "");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValidEmail(text === "" || validateEmail(text));
  };

  const saveEmail = () => {
    if (email === "" || validateEmail(email)) {
      setUserEmail(email);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Success", "Email updated successfully");
    } else {
      setIsValidEmail(false);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const toggleAlertSetting = (setting: keyof typeof alertSettings) => {
    updateAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting]
    });
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const updateThreshold = (value: string, setting: 'heatIndexThreshold' | 'temperatureThreshold') => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      updateAlertSettings({
        ...alertSettings,
        [setting]: numValue
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundDark, Colors.backgroundLight]}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={24} color="#fff" />
            <Text style={styles.sectionTitle}>Email Notifications</Text>
          </View>
          
          <View style={styles.emailContainer}>
            <TextInput
              style={[
                styles.emailInput,
                !isValidEmail && styles.invalidInput
              ]}
              placeholder="Your email address"
              value={email}
              onChangeText={handleEmailChange}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isValidEmail && (
              <Text style={styles.errorText}>Please enter a valid email address</Text>
            )}
            <Pressable 
              style={styles.saveButton}
              onPress={saveEmail}
            >
              <Text style={styles.saveButtonText}>Save Email</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={24} color="#fff" />
            <Text style={styles.sectionTitle}>Alert Settings</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Heat Index Alerts</Text>
              <Text style={styles.settingDescription}>
                Get alerts when heat index reaches dangerous levels
              </Text>
            </View>
            <Switch
              value={alertSettings.heatIndexEnabled}
              onValueChange={() => toggleAlertSetting('heatIndexEnabled')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={alertSettings.heatIndexEnabled ? Colors.primary : "#f4f3f4"}
            />
          </View>

          {alertSettings.heatIndexEnabled && (
            <View style={styles.thresholdContainer}>
              <Text style={styles.thresholdLabel}>
                Heat Index Threshold (°F)
              </Text>
              <TextInput
                style={styles.thresholdInput}
                value={alertSettings.heatIndexThreshold.toString()}
                onChangeText={(value) => updateThreshold(value, 'heatIndexThreshold')}
                keyboardType="number-pad"
              />
            </View>
          )}

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Temperature Alerts</Text>
              <Text style={styles.settingDescription}>
                Get alerts when temperature exceeds your threshold
              </Text>
            </View>
            <Switch
              value={alertSettings.temperatureEnabled}
              onValueChange={() => toggleAlertSetting('temperatureEnabled')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={alertSettings.temperatureEnabled ? Colors.primary : "#f4f3f4"}
            />
          </View>

          {alertSettings.temperatureEnabled && (
            <View style={styles.thresholdContainer}>
              <Text style={styles.thresholdLabel}>
                Temperature Threshold (°F)
              </Text>
              <TextInput
                style={styles.thresholdInput}
                value={alertSettings.temperatureThreshold.toString()}
                onChangeText={(value) => updateThreshold(value, 'temperatureThreshold')}
                keyboardType="number-pad"
              />
            </View>
          )}

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Forecast</Text>
              <Text style={styles.settingDescription}>
                Receive a daily forecast email each morning
              </Text>
            </View>
            <Switch
              value={alertSettings.dailyForecastEnabled}
              onValueChange={() => toggleAlertSetting('dailyForecastEnabled')}
              trackColor={{ false: "#767577", true: Colors.primaryLight }}
              thumbColor={alertSettings.dailyForecastEnabled ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Info size={20} color="#fff" />
          <Text style={styles.infoText}>
            Heat alerts are sent when conditions reach your specified thresholds. Make sure to add locations and set your email to receive alerts.
          </Text>
        </View>

        {savedLocations.length === 0 && (
          <View style={styles.warningSection}>
            <AlertTriangle size={20} color={Colors.warning} />
            <Text style={styles.warningText}>
              You haven't added any locations yet. Go to the Locations tab to add locations for monitoring.
            </Text>
          </View>
        )}

        {!userEmail && (
          <View style={styles.warningSection}>
            <AlertTriangle size={20} color={Colors.warning} />
            <Text style={styles.warningText}>
              You need to add your email address to receive alerts.
            </Text>
          </View>
        )}
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
  emailContainer: {
    marginBottom: 10,
  },
  emailInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  invalidInput: {
    borderColor: Colors.danger,
    borderWidth: 1,
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    marginRight: 10,
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
  thresholdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginVertical: 8,
  },
  thresholdLabel: {
    color: "#fff",
    fontSize: 14,
  },
  thresholdInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    padding: 8,
    width: 80,
    textAlign: "center",
    color: "#fff",
  },
  infoSection: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#fff",
    marginLeft: 10,
    flex: 1,
  },
  warningSection: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 204, 0, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  warningText: {
    color: "#fff",
    marginLeft: 10,
    flex: 1,
  },
});
