import {useEffect, useRef} from 'react';
import {Alert, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {setGeolocation} from '../../module/geolocation';
import {getData, storeData} from '../../utils/asyncStorage';
import BackgroundGeolocation, {
  ConfigureOptions,
} from '@mauron85/react-native-background-geolocation';
import appConfig from '../../app.json';

const LOCATION = 'LOCATION';

export const geolocationConfig: ConfigureOptions = {
  desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  stationaryRadius: 10,
  distanceFilter: 10,
  startForeground: false,
  notificationsEnabled: false,
  notificationIconLarge: 'ic_launcher_round',
  notificationIconSmall: 'ic_launcher_round',
  notificationTitle: appConfig.name,
  notificationText: '산책 기록 중 입니다...',
  debug: false,
  startOnBoot: false,
  stopOnTerminate: true,
  locationProvider:
    Platform.OS === 'android'
      ? BackgroundGeolocation.DISTANCE_FILTER_PROVIDER
      : BackgroundGeolocation.ACTIVITY_PROVIDER,
  interval: 2000,
  fastestInterval: 0,
  activitiesInterval: 1000,
  stopOnStillActivity: false,
};

function GeolocationComponent() {
  const dispatch = useDispatch();

  const getLocation = async () => {
    BackgroundGeolocation.getCurrentLocation(
      async location => {
        console.log('geoComp:', location);
        dispatch(
          setGeolocation({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        );
        await storeData({
          key: LOCATION,
          value: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      },
      error => {
        console.log(error);
        Alert.alert('Error', '위치정보를 불러오는데 실패했습니다.');
      },
    );
  };

  useEffect(() => {
    getData({key: LOCATION}).then(
      (data: {latitude: number; longitude: number}) => {
        if (data?.latitude && data?.longitude) {
          dispatch(setGeolocation({...data}));
        }
      },
    );
    getLocation();
  }, []);

  useEffect(() => {
    BackgroundGeolocation.configure(geolocationConfig);
  });

  return null;
}

export default GeolocationComponent;
