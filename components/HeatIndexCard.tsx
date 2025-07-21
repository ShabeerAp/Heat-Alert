import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { calculateHeatIndex, getHeatIndexCategory } from "@/utils/weatherUtils";

interface HeatIndexCardProps {
  temperature: number;
  humidity: number;
}

export default function HeatIndexCard({ temperature, humidity }: HeatIndexCardProps) {
  const heatIndex = calculateHeatIndex(temperature, humidity);
  const { category, color, message } = getHeatIndexCategory(heatIndex);

  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Heat Index</Text>
        {category !== "Normal" && (
          <AlertTriangle size={20} color="#fff" />
        )}
      </View>
      
      <Text style={styles.heatIndexValue}>
        {Math.round(heatIndex)}°
      </Text>
      
      <Text style={styles.category}>
        {category}
      </Text>
      
      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heatIndexValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 4,
  },
  category: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
