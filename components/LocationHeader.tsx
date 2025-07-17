import React from 'react';

interface LocationHeaderProps {
  city: string;
  region: string;
  time: string;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({ city, region, time }) => {
  return (
    <header style={{
      padding: '1rem',
      backgroundColor: '#1976D2',
      color: '#fff',
      borderRadius: '0.75rem',
      marginBottom: '1rem'
    }}>
      <h2>{city}, {region}</h2>
      <small>{time}</small>
    </header>
  );
};

export default LocationHeader;
