import dayjs from 'dayjs';
import React from 'react';
import IconWeatherClearDay from './IconWeatherClearDay';
import IconWeatherClearNight from './IconWeatherClearNight';
import IconWeatherCloudy from './IconWeatherCloudy';
import IconWeatherFog from './IconWeatherFog';
import IconWeatherHeavyRain from './IconWeatherHeavyRain';
import IconWeatherOvercast from './IconWeatherOvercast';
import IconWeatherRain from './IconWeatherRain';
import IconWeatherSnow from './IconWeatherSnow';
import IconWeatherThunderRain from './IconWeatherThunderRain';
import IconWeatherWindy from './IconWeatherWindy';

interface IWeather {
  weather: string;
  size?: number;
}

function WeatherIcon({weather, size = 150}: IWeather) {
  const isDay = () => {
    const nowHour = dayjs().hour();
    return nowHour > 6 && nowHour < 18;
  };

  const atmosphere = [
    'Mist',
    'Smoke',
    'Haze',
    'Dust',
    'Fog',
    'Sand',
    'Dust',
    'Ash',
  ];
  const windy = ['Squall', 'Tornado'];

  return (
    <>
      {weather === 'Thunderstorm' && <IconWeatherThunderRain />}
      {weather === 'Drizzle' && <IconWeatherRain />}
      {weather === 'Rain' && <IconWeatherHeavyRain />}
      {weather === 'Snow' && <IconWeatherSnow />}
      {atmosphere.includes(weather) && <IconWeatherFog />}
      {weather === 'Clear' && (
        <>{isDay() ? <IconWeatherClearDay /> : <IconWeatherClearNight />}</>
      )}
      {weather === 'Clouds' && (
        <>{isDay() ? <IconWeatherCloudy /> : <IconWeatherOvercast />}</>
      )}
      {windy.includes(weather) && <IconWeatherWindy />}
    </>
  );
}

export default WeatherIcon;
