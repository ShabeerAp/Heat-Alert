import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

interface WeatherCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function WeatherCard({ title, value, icon }: WeatherCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
