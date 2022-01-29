import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {routes} from '../../routes';
import WeatherIcon from './components/WeatherIcon';
import {getAddressFromLatLng} from '../../utils/googlemaps/geocoding';
import {openAqi, openWeather} from '../../utils/types/openWeatherMap.types';
import TextComp from '../components/TextComp';
import AqiComponent from './components/AqiComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';

function WheatherScrean() {
  //0:onecall날씨정보, 1:미세먼지 2:주소
  const [[weather, aqi, location], setWeatherData] = useState<
    [openWeather, openAqi, string]
  >([undefined, undefined, '']);
  const geolocation = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );
  const APIkey = 'c426ab12a65113b5edf8fa2bc8bf914f';

  const navigation = useNavigation();

  const getWeather = async () => {
    try {
      const response = await Promise.all([
        //날씨정보
        await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${geolocation.latitude}&lon=${geolocation.longitude}&exclude=minutely,alerts&units=metric&appid=${APIkey}`,
        ).then(r => r.json()),
        //미세먼지
        await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${geolocation.latitude}&lon=${geolocation.longitude}&appid=${APIkey}`,
        ).then(r => r.json()),
        await getAddressFromLatLng({
          lat: geolocation.latitude,
          lng: geolocation.longitude,
        }),
      ]);
      console.log(response);
      setWeatherData(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (geolocation?.latitude && geolocation.longitude) {
      getWeather();
    }
  }, [geolocation]);

  return (
    <View style={styles.wrapper}>
      {Boolean(location.length) && <TextComp text={location} />}
      {weather && (
        <>
          <WeatherIcon weather={weather.current.weather[0].main} />
          <TextComp text={weather.daily[0].temp.min} />
          <TextComp text={`${weather.current.temp}°C,`} />
          <TextComp text={weather.daily[0].temp.max} />

          {aqi && (
            <AqiComponent
              pm10={aqi.list[0].components.pm10}
              pm2_5={aqi.list[0].components.pm2_5}
            />
          )}

          <View style={styles.weekWeather}>
            {weather.hourly.map(({dt, weather, temp}, idx) => {
              if (idx < 8) {
                return (
                  <View key={idx}>
                    <TextComp text={`${new Date(dt * 1000).getHours()}시`} />
                    <WeatherIcon size={30} weather={weather[0].main} />
                    <TextComp size={10} text={`${temp}°C`} />
                  </View>
                );
              }
            })}
          </View>

          <View style={styles.weekWeather}>
            {weather.daily.map(({dt, temp, weather}, idx) => (
              <View key={idx}>
                <TextComp text={`${new Date(dt * 1000).getDate()}일`} />
                <WeatherIcon size={30} weather={weather[0].main} />
                <TextComp size={10} text={`${temp.max}°C`} />
                <TextComp size={10} text={`${temp.min}°C`} />
              </View>
            ))}
          </View>
        </>
      )}
      <Button
        title="산책하러가기"
        onPress={() => {
          navigation.navigate(routes.record);
        }}
      />
      <Button
        title="산책 기록 보기"
        onPress={() => {
          navigation.navigate(routes.walkRecords);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  weekWeather: {
    flexDirection: 'row',
  },
});

export default WheatherScrean;
