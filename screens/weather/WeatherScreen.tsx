import React, {useEffect, useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import EvIcon from 'react-native-vector-icons/EvilIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import WeatherIcon from './components/WeatherIcon';
import {getAddressFromLatLng} from '../../utils/googlemaps/geocoding';
import {openAqi, openWeather} from '../../utils/types/openWeatherMap.types';
import TextComp from '../components/TextComp';
import AqiComponent from './components/AqiComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {Geolocation} from '../../module/geolocation';
import {colors} from '../../utils/colors';
import {UseNavigationProp} from '../../routes';

function WeatherScreen() {
  //0:onecall날씨정보, 1:미세먼지 2:주소
  const [[weather, aqi, location], setWeatherData] = useState<
    [openWeather, openAqi, string]
  >([undefined, undefined, '']);
  const geolocation = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );
  const APIkey = 'c426ab12a65113b5edf8fa2bc8bf914f';

  const navigation = useNavigation<UseNavigationProp<'WalkTab'>>();

  const getWeather = async ({latitude, longitude}: Geolocation) => {
    try {
      const response = await Promise.all([
        //날씨정보
        await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=${APIkey}`,
        ).then(r => r.json()),
        //미세먼지
        await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${APIkey}`,
        ).then(r => r.json()),
        await getAddressFromLatLng({
          lat: latitude,
          lng: longitude,
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
      getWeather({...geolocation});
    }
  }, [geolocation]);

  return (
    <>
      <ScrollView style={styles.wrapper}>
        {Boolean(location) && (
          <View style={styles.locationTitle}>
            <EvIcon name="location" size={25} />
            <TextComp text={location} size={20} />
          </View>
        )}
        {weather && (
          <>
            <View style={styles.tempContainer}>
              <WeatherIcon
                size={150}
                weather={weather.current.weather[0].main}
              />
              <View style={styles.tempBlock}>
                <View style={styles.hContainer}>
                  <View>
                    <View style={styles.tempText}>
                      <TextComp
                        text={`${weather.current.temp.toFixed(1)}`}
                        size={30}
                      />
                      <TextComp text={`°C`} size={20} />
                    </View>
                    <TextComp text={'현재 기온'} />
                  </View>

                  <View>
                    <View style={styles.tempText}>
                      <TextComp
                        text={`${weather.current.feels_like.toFixed(1)}`}
                        size={30}
                      />
                      <TextComp text={`°C`} size={20} />
                    </View>
                    <TextComp text={'체감 온도'} />
                  </View>
                </View>

                <View style={styles.hContainer}>
                  <View>
                    <View style={styles.tempText}>
                      <TextComp
                        text={`${weather.daily[0].temp.min.toFixed(1)}`}
                        size={30}
                      />
                      <TextComp text={`°C`} size={20} />
                    </View>
                    <TextComp text={'최저 기온'} />
                  </View>

                  <View>
                    <View style={styles.tempText}>
                      <TextComp
                        text={`${weather.daily[0].temp.max.toFixed(1)}`}
                        size={30}
                      />
                      <TextComp text={`°C`} size={20} />
                    </View>
                    <TextComp text={'최고 기온'} />
                  </View>
                </View>
              </View>
            </View>

            {aqi && (
              <AqiComponent
                pm10={aqi.list[0].components.pm10}
                pm2_5={aqi.list[0].components.pm2_5}
              />
            )}

            <TextComp text={'시간대별 날씨'} size={20} />
            <View style={styles.weekWeather}>
              {weather.hourly.map(({dt, weather, temp}, idx) => {
                if (idx < 8) {
                  return (
                    <View key={idx}>
                      <TextComp text={`${new Date(dt * 1000).getHours()}시`} />
                      <WeatherIcon size={30} weather={weather[0].main} />
                      <TextComp size={10} text={`${temp.toFixed(1)}°C`} />
                    </View>
                  );
                }
              })}
            </View>

            <TextComp text={'요일별 날씨'} size={20} />
            <View style={styles.weekWeather}>
              {weather.daily.map(({dt, temp, weather}, idx) => (
                <View key={idx}>
                  <TextComp text={`${new Date(dt * 1000).getDate()}일`} />
                  <WeatherIcon size={30} weather={weather[0].main} />
                  <TextComp size={10} text={`${temp.max.toFixed(1)}°C`} />
                  <TextComp size={10} text={`${temp.min.toFixed(1)}°C`} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.dogFace}>
          <MCIcon name="dog" size={40} />
        </TouchableOpacity>
        <View style={styles.describeContainer}>
          <TextComp text={'순대'} />
          <TextComp text={'산책시간 : 0분 / 30분'} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="산책하러가기"
            onPress={() => {
              navigation.navigate('Record');
            }}
          />
          <Button
            title="산책 기록 보기"
            onPress={() => {
              navigation.navigate('WalkRecords');
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '85%',
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
    height: '35%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tempBlock: {
    paddingVertical: 20,
    flex: 1,
  },
  hContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tempText: {
    flexDirection: 'row',
  },
  weekWeather: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  bottomContainer: {
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    height: '100%',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    marginLeft: 'auto',
    justifyContent: 'space-between',
  },
});

export default WeatherScreen;
