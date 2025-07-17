import React from 'react';

interface WeatherCardProps {
  date: string;
  temperature: number;
  humidity: number;
  uvIndex: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ date, temperature, humidity, uvIndex }) => {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h4>{date}</h4>
      <p>Temperature: {temperature}°C</p>
      <p>Humidity: {humidity}%</p>
      <p>UV Index: {uvIndex}</p>
    </div>
  );
};

export default WeatherCard;
