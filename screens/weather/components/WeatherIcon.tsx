import React from 'react';
import IOIcon from 'react-native-vector-icons/Ionicons';
import FeIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

interface IWeather {
  weather: string;
  size?: number;
}

function WeatherIcon({weather, size = 150}: IWeather) {
  const Atmosphere = [
    'Mist',
    'Smoke',
    'Haze',
    'Dust',
    'Fog',
    'Sand',
    'Dust',
    'Ash',
    'Squall',
    'Tornado',
  ];

  return (
    <>
      {weather === 'Thunderstorm' && (
        <IOIcon size={size} name="thunderstorm-outline" />
      )}
      {weather === 'Drizzle' && <IOIcon size={size} name="rainy-outline" />}
      {weather === 'Rain' && <FeIcon size={size} name="cloud-drizzle" />}
      {weather === 'Snow' && <MCIcon size={size} name="weather-snowy-heavy" />}
      {Atmosphere.includes(weather) && <FAIcon size={size} name="smog" />}
      {weather === 'Clear' && <IOIcon size={size} name="sunny-outline" />}
      {weather === 'Clouds' && <IOIcon size={size} name="cloudy-outline" />}
    </>
  );
}

export default WeatherIcon;
