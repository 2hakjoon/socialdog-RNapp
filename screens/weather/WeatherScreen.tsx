import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import EvIcon from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
import WeatherIcon from './template/WeatherIcon';
import {getAddressFromLatLng} from '../../utils/googlemaps/geocoding';
import {openAqi, openWeather} from '../../utils/types/openWeatherMap.types';
import TextComp from '../components/TextComp';
import AqiComponent from './components/AqiComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {Geolocation} from '../../module/geolocation';
import {colors} from '../../utils/colors';
import {UseNavigationProp} from '../../routes';
import {useQuery} from '@apollo/client';
import {QMe} from '../../__generated__/QMe';
import {ME} from '../../apollo-gqls/auth';
import {getWeatherData, storeWeatherData} from '../../utils/asyncStorage';
import Config from 'react-native-config';

function WeatherScreen() {
  //0:onecall날씨정보, 1:미세먼지 2:주소
  const [[weather, aqi, location], setWeatherData] = useState<
    [openWeather, openAqi, string]
  >([undefined, undefined, '']);
  const {data} = useQuery<QMe>(ME);
  const user = data?.me.data;
  const geolocation = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );

  const navigation = useNavigation<UseNavigationProp<'WalkTab'>>();

  const getWeather = async ({latitude, longitude}: Geolocation) => {
    try {
      const response = await Promise.all([
        //날씨정보
        await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=${Config.OPEN_API_KEY}`,
        )
          .then(r => r.json())
          .catch(e => console.log(e)),
        //미세먼지
        await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${Config.OPEN_API_KEY}`,
        )
          .then(r => r.json())
          .catch(e => console.log(e)),
        //주소정보
        await getAddressFromLatLng({
          lat: latitude,
          lng: longitude,
        }),
      ]);
      setWeatherData(response);
      storeWeatherData(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeatherData().then(data => {
      if (data !== null) {
        setWeatherData(data);
      }
    });
    if (geolocation?.latitude && geolocation.longitude) {
      getWeather({...geolocation});
    }
  }, [geolocation]);

  return (
    <>
      <ScrollView style={styles.wrapper}>
        {location.length > 0 && (
          <View style={styles.locationTitle}>
            <EvIcon name="location" size={25} />
            <TextComp text={location} size={20} />
          </View>
        )}
        {weather?.current ? (
          <>
            <View style={styles.tempContainer}>
              <WeatherIcon
                size={150}
                weather={weather.current.weather[0].main}
              />
              <View style={styles.tempBlockWrapper}>
                <View style={styles.feelTemp}>
                  <TextComp text={'체감 온도'} color={colors.PDarkGray} />
                  <View style={styles.tempText}>
                    <TextComp
                      text={`${weather.current.feels_like.toFixed(1)}`}
                      size={20}
                      color={colors.PDarkGray}
                    />
                    <TextComp text={'°C'} size={10} color={colors.PDarkGray} />
                  </View>
                </View>

                <View style={styles.currTemp}>
                  <View style={styles.tempText}>
                    <TextComp
                      text={`${weather.current.temp.toFixed(1)}`}
                      size={40}
                    />
                    <TextComp text={'°C'} size={30} />
                  </View>
                  <TextComp text={'현재 기온'} size={20} />
                </View>

                <View style={styles.feelTemp}>
                  <TextComp text={' '} color={colors.PDarkGray} />
                  <View style={styles.tempText}>
                    <TextComp text={' '} size={20} color={colors.PDarkGray} />
                    <TextComp text={' '} size={10} color={colors.PDarkGray} />
                  </View>
                </View>
              </View>
            </View>

            {aqi?.list && (
              <AqiComponent
                pm10={aqi.list[0].components.pm10}
                pm2_5={aqi.list[0].components.pm2_5}
              />
            )}

            <TextComp text={'시간대별 날씨'} size={22} />
            <ScrollView horizontal style={styles.weatherArray}>
              {weather.hourly.map(({dt, weather, temp}, idx) => {
                if (idx < 8) {
                  return (
                    <View key={idx} style={styles.weatherBlock}>
                      <TextComp
                        text={`${new Date(dt * 1000).getHours()}시`}
                        size={14}
                      />
                      <WeatherIcon size={35} weather={weather[0].main} />
                      <TextComp text={`${Math.round(temp)}°C`} />
                    </View>
                  );
                }
              })}
            </ScrollView>

            <TextComp text={'이번주 날씨'} size={22} />
            <ScrollView horizontal style={styles.weatherArray}>
              {weather.daily.map(({dt, temp, weather}, idx) => (
                <View key={idx} style={styles.weatherBlock}>
                  <TextComp
                    text={`${new Date(dt * 1000).getDate()}일`}
                    size={14}
                  />
                  <WeatherIcon size={35} weather={weather[0].main} />
                  <TextComp size={12} text={`${Math.round(temp.max)}°C`} />
                  <TextComp size={12} text={`${Math.round(temp.min)}°C`} />
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextComp text={'날씨정보를 받아오는 중입니다....'} />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  locationTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    flexDirection: 'row',
  },
  tempContainer: {
    width: '100%',
    height: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tempBlockWrapper: {
    width: '100%',
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  feelTemp: {
    width: '80%',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  currTemp: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  tempText: {
    flexDirection: 'row',
  },
  weatherArray: {
    flexDirection: 'row',
  },
  weatherBlock: {
    height: 120,
    alignItems: 'center',
    paddingRight: 10,
    justifyContent: 'center',
  },
  dogFace: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: colors.PBlue,
    borderWidth: 3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  describeContainer: {
    justifyContent: 'space-around',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WeatherScreen;
