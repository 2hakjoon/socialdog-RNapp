import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WeatherIcon from './WeatherIcon';
import {getAddressFromLatLng} from '../../../utils/googlemaps/geocoding';
import {openAqi, openWeather} from '../../../utils/types/openWeatherMap.types';
import TextComp from '../../components/TextComp';
import AqiComponent, {pm10Level, pm2_5Level} from '../components/AqiComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../../../module';
import {Geolocation} from '../../../module/geolocation';
import {UseNavigationProp} from '../../../routes';
import {useQuery, useReactiveVar} from '@apollo/client';
import {QMe} from '../../../__generated__/QMe';
import {ME} from '../../../apollo-gqls/auth';
import {getWeatherData, storeWeatherData} from '../../../utils/asyncStorage';
import {mvGeolocationPermission} from '../../../apollo-setup';
import Config from 'react-native-config';

function WeatherCard() {
  //0:onecall날씨정보, 1:미세먼지 2:주소
  const [[weather, aqi, location], setWeatherData] = useState<
    [openWeather, openAqi, string]
  >([undefined, undefined, '']);
  const geolocationPermission = useReactiveVar(mvGeolocationPermission);
  const [weahterDataLoding, setWeahterDataLoading] = useState(true);
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
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=${Config.OPEN_WEATHER_API_KEY}`,
        )
          .then(r => r.json())
          .catch(e => console.log(e)),
        //미세먼지
        await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${Config.OPEN_WEATHER_API_KEY}`,
        )
          .then(r => r.json())
          .catch(e => console.log(e)),
        //주소정보
        await getAddressFromLatLng({
          lat: latitude,
          lng: longitude,
        }),
      ]);
      setWeahterDataLoading(false);
      setWeatherData(response);
      storeWeatherData(response);
    } catch (e) {
      console.log(e);
    }
  };

  const moveToWeatherScreen = () => {
    navigation.push('Weather');
  };

  useEffect(() => {
    if (geolocation?.latitude && geolocation.longitude) {
      getWeather({...geolocation});
    }
  }, [geolocation]);

  useEffect(() => {
    getWeatherData().then(data => {
      if (data !== null) {
        setWeatherData(data);
      }
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      {weather?.current ? (
        <>
          <TouchableOpacity
            style={styles.tempContainer}
            onPress={() => moveToWeatherScreen()}>
            <WeatherIcon size={40} weather={weather.current.weather[0].main} />
            <View style={styles.currTemp}>
              <View style={styles.tempText}>
                <TextComp
                  text={`${weather.current.temp.toFixed(1)}`}
                  size={30}
                />
                <TextComp text={'°C'} size={20} />
              </View>
            </View>
            {aqi?.list && (
              <View style={styles.aqiOuterWrapper}>
                <TextComp text={'미세먼지'} weight="500" />
                <TextComp
                  text={pm2_5Level(aqi.list[0].components.pm10)}
                  size={20}
                  weight="600"
                />
              </View>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View
          style={{
            ...styles.tempContainer,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {geolocationPermission ? (
            <>
              {weahterDataLoding ? (
                <TextComp text={'날씨정보를 받아오는 중입니다....'} />
              ) : (
                <TextComp text={'날씨정보를 받아오는데 실패했습니다.'} />
              )}
            </>
          ) : (
            <TextComp text={'위치정보 권한을 설정해주세요.'} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 30,
    width: '100%',
    height: '100%',
    //ios
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 13,
        shadowOffset: {
          height: 10,
          width: 0,
        },
      },
      //android
      android: {
        elevation: 20,
      },
    }),
  },
  currTemp: {paddingLeft: 20},
  tempText: {
    flexDirection: 'row',
  },
  aqiOuterWrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingRight: 10,
    marginLeft: 'auto',
  },
  aqiBlock: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default WeatherCard;
