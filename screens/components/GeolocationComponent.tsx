import Geolocation, {GeoOptions} from 'react-native-geolocation-service';
import {useEffect, useRef} from 'react';
import {Alert, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {useDispatch} from 'react-redux';
import {setGeolocation} from '../../module/geolocation';
import {getData, storeData} from '../../utils/asyncStorage';
import {check, PERMISSIONS, request} from 'react-native-permissions';

const LOCATION = 'LOCATION';

const checkIosLocationPermission = async () => {
  const always = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
  const whenUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  // console.log(always, whenUse);
  if (always === 'granted' || whenUse === 'granted') {
    return true;
  } else {
    Alert.alert(
      '백그라운드 위치정보.',
      '정상적인 위치 수집을 위해, 위치정보를 항상 허용으로 설정해주세요',
      [
        {
          text: '알겠어요',
          onPress: () => {
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
              .then(result => {
                // console.log(result);
                if (result !== 'blocked') {
                  return true;
                }
              })
              .catch(error => console.log(error));
          },
        },
      ],
    );
  }
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await checkIosLocationPermission();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('위치정보 권한이 거절되었습니다.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('위치정보 권한이 거절되었습니다.', ToastAndroid.LONG);
  }

  return false;
};

export const geolocationCofig: GeoOptions = {
  accuracy: {
    android: 'high',
    ios: 'bestForNavigation',
  },
  enableHighAccuracy: true,
  timeout: 2000,
  maximumAge: 0,
};

function GeolocationComponent() {
  const dispatch = useDispatch();

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
        storeData({
          key: LOCATION,
          value: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      error => {
        console.log(error);
        Alert.alert('Error', '위치정보 권한을 설정해주세요.');
      },
      geolocationCofig,
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

  return null;
}

export default GeolocationComponent;
