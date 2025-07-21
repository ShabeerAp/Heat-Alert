import Colors from "@/constants/colors";

// Calculate heat index using the formula from the National Weather Service
export function calculateHeatIndex(temperature: number, humidity: number): number {
  // Ensure temperature is in Fahrenheit for the calculation
  const T = temperature;
  const RH = humidity;

  // Simple formula for heat index
  let heatIndex = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));

  // If the heat index is less than 80F, use the simple formula
  if (heatIndex >= 80) {
    // Use the full regression formula
    heatIndex = -42.379 + 
                 2.04901523 * T + 
                 10.14333127 * RH - 
                 0.22475541 * T * RH - 
                 6.83783e-3 * T * T - 
                 5.481717e-2 * RH * RH + 
                 1.22874e-3 * T * T * RH + 
                 8.5282e-4 * T * RH * RH - 
                 1.99e-6 * T * T * RH * RH;
  }

  return heatIndex;
}

// Get heat index category and color based on the value
export function getHeatIndexCategory(heatIndex: number) {
  if (heatIndex < 80) {
    return {
      category: "Normal",
      color: "rgba(0, 128, 0, 0.7)",
      message: "Heat index is at a comfortable level."
    };
  } else if (heatIndex < 90) {
    return {
      category: "Caution",
      color: "rgba(255, 204, 0, 0.7)",
      message: "Fatigue possible with prolonged exposure and activity."
    };
  } else if (heatIndex < 103) {
    return {
      category: "Extreme Caution",
      color: "rgba(255, 153, 0, 0.7)",
      message: "Heat cramps and heat exhaustion possible with prolonged exposure."
    };
  } else if (heatIndex < 125) {
    return {
      category: "Danger",
      color: "rgba(255, 51, 0, 0.7)",
      message: "Heat cramps and heat exhaustion likely; heat stroke possible with prolonged exposure."
    };
  } else {
    return {
      category: "Extreme Danger",
      color: "rgba(204, 0, 0, 0.7)",
      message: "Heat stroke highly likely with continued exposure. Take immediate precautions!"
    };
  }
}

// Get gradient colors based on temperature
export function getGradientColors(temperature: number) {
  if (temperature < 32) {
    // Cold
    return [Colors.coldDark, Colors.coldLight];
  } else if (temperature < 50) {
    // Cool
    return [Colors.coolDark, Colors.coolLight];
  } else if (temperature < 70) {
    // Mild
    return [Colors.mildDark, Colors.mildLight];
  } else if (temperature < 85) {
    // Warm
    return [Colors.warmDark, Colors.warmLight];
  } else if (temperature < 95) {
    // Hot
    return [Colors.hotDark, Colors.hotLight];
  } else {
    // Very Hot
    return [Colors.extremeDark, Colors.extremeLight];
  }
}

// Convert temperature between Celsius and Fahrenheit
export function convertTemperature(temp: number, toCelsius: boolean): number {
  if (toCelsius) {
    // Convert from F to C
    return (temp - 32) * 5/9;
  } else {
    // Convert from C to F
    return (temp * 9/5) + 32;
  }
}
