// utils/weatherUtils.ts

/**
 * Calculates Heat Index using temperature (°C) and relative humidity (%).
 * Formula used is Steadman's approximation converted from Fahrenheit.
 */
export function calculateHeatIndex(tempCelsius: number, humidity: number): number {
  // Convert to Fahrenheit
  const tempF = (tempCelsius * 9) / 5 + 32;

  const heatIndexF =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;

  // Convert back to Celsius
  return Math.round(((heatIndexF - 32) * 5) / 9);
}

/**
 * Returns risk level based on Heat Index (°C).
 * Follows common heat alert categorization.
 */
export function getRiskLevel(heatIndex: number): 'Low' | 'Moderate' | 'High' | 'Extreme' {
  if (heatIndex < 27) return 'Low';
  if (heatIndex < 32) return 'Moderate';
  if (heatIndex < 41) return 'High';
  return 'Extreme';
}

/**
 * Returns safety advice based on heat index and UV index.
 */
export function getSafetyAdvice(heatIndex: number, uvIndex: number): string[] {
  const advice: string[] = [];

  // Heat-related advice
  const heatRisk = getRiskLevel(heatIndex);
  if (heatRisk === 'Moderate') {
    advice.push('Stay hydrated and avoid outdoor activity during peak heat.');
  } else if (heatRisk === 'High') {
    advice.push('Limit exposure to sun, wear light clothing, and take frequent breaks.');
  } else if (heatRisk === 'Extreme') {
    advice.push('Avoid outdoor activity. Stay indoors with cooling if possible.');
  }

  // UV-related advice
  if (uvIndex >= 6 && uvIndex < 8) {
    advice.push('Use sunscreen and wear a hat when going outside.');
  } else if (uvIndex >= 8) {
    advice.push('UV levels are very high. Minimize direct sunlight exposure.');
  }

  // General tip
  if (heatRisk === 'Low' && uvIndex < 6) {
    advice.push('Conditions are safe. Continue usual activities.');
  }

  return advice;
}
