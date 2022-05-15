import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import IconWeatherClearDay from '../components/IconWeatherClearDay';
import IconWeatherClearNight from '../components/IconWeatherClearNight';
import IconWeatherCloudy from '../components/IconWeatherCloudy';
import IconWeatherFog from '../components/IconWeatherFog';
import IconWeatherHeavyRain from '../components/IconWeatherHeavyRain';
import IconWeatherOvercast from '../components/IconWeatherOvercast';
import IconWeatherRain from '../components/IconWeatherRain';
import IconWeatherSnow from '../components/IconWeatherSnow';
import IconWeatherThunderRain from '../components/IconWeatherThunderRain';
import IconWeatherThunderSnow from '../components/IconWeatherThunderSnow';
import IconWeatherWindy from '../components/IconWeatherWindy';

interface IWeather {
  weather: string;
  size?: number;
}
export interface IWeatherIconProps {
  size: number;
}

function WeatherIcon({weather, size = 150}: IWeather) {
  const isDay = () => {
    const nowHour = dayjs().hour();
    return nowHour > 6 && nowHour < 20;
  };

  const isSummer = () => {
    const nowMonth = dayjs().month();
    return nowMonth > 4 && nowMonth < 10;
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
    <View
      style={{
        ...(isDay() ? styles.dayBackBig : styles.nightBackBig),
        padding: size > 100 ? 20 : 5,
      }}>
      {weather === 'Thunderstorm' && (
        <>
          {isSummer() ? (
            <IconWeatherThunderRain size={size} />
          ) : (
            <IconWeatherThunderSnow size={size} />
          )}
        </>
      )}
      {weather === 'Drizzle' && <IconWeatherRain size={size} />}
      {weather === 'Rain' && <IconWeatherHeavyRain size={size} />}
      {weather === 'Snow' && <IconWeatherSnow size={size} />}
      {atmosphere.includes(weather) && <IconWeatherFog size={size} />}
      {weather === 'Clear' && (
        <>
          {isDay() ? (
            <IconWeatherClearDay size={size} />
          ) : (
            <IconWeatherClearNight size={size} />
          )}
        </>
      )}
      {weather === 'Clouds' && (
        <>
          {isDay() ? (
            <IconWeatherCloudy size={size} />
          ) : (
            <IconWeatherOvercast size={size} />
          )}
        </>
      )}
      {windy.includes(weather) && <IconWeatherWindy size={size} />}
    </View>
  );
}

const styles = StyleSheet.create({
  dayBackBig: {
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
  },
  nightBackBig: {
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
});

export default WeatherIcon;
