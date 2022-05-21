import {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {setGeolocation} from '../../module/geolocation';
import {getData, storeData} from '../../utils/asyncStorage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const LOCATION = 'LOCATION';

function GeolocationComponent() {
  const dispatch = useDispatch();

  const getLocation = async () => {
    BackgroundGeolocation.getCurrentLocation(
      location => {
        console.log('geoComp:', location);
        dispatch(
          setGeolocation({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        );
        storeData({
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
    getData({key: LOCATION}).then(data => {
      if (data) {
        dispatch(setGeolocation({...data}));
      }
    });
    getLocation();
  }, []);

  useEffect(() => {
    //리스너 제거
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 10,
      distanceFilter: 10,
      startForeground: true,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 5000,
      fastestInterval: 2000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
    });
  });

  return null;
}

export default GeolocationComponent;
