import React from 'react';
import { COLORS } from '../constants/colors';

interface HeatIndexCardProps {
  heatIndex: number;
  feelsLike: number;
  riskLevel: 'Safe' | 'Warning' | 'Danger';
}

const getColor = (risk: string) => {
  switch (risk) {
    case 'Danger': return COLORS.danger;
    case 'Warning': return COLORS.warning;
    default: return COLORS.safe;
  }
};

const HeatIndexCard: React.FC<HeatIndexCardProps> = ({ heatIndex, feelsLike, riskLevel }) => {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '1rem',
      backgroundColor: getColor(riskLevel),
      color: '#fff',
      marginBottom: '1rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>Heat Index: {heatIndex}°C</h3>
      <p>Feels Like: {feelsLike}°C</p>
      <strong>Risk Level: {riskLevel}</strong>
    </div>
  );
};

export default HeatIndexCard;
