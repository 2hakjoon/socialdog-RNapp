import {useEffect, useRef} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {setGeolocation} from '../../module/geolocation';
import {getData, storeData} from '../../utils/asyncStorage';
import BackgroundGeolocation, {
  ConfigureOptions,
} from '@mauron85/react-native-background-geolocation';
import appConfig from '../../app.json';
import {mvGeolocationPermission} from '../../apollo-setup';

const LOCATION = 'LOCATION';

export const geolocationConfig: ConfigureOptions = {
  desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  stationaryRadius: 2,
  distanceFilter: 10,
  startForeground: false,
  notificationsEnabled: false,
  notificationIconLarge: 'ic_launcher_round',
  notificationIconSmall: 'ic_launcher_round',
  notificationTitle: appConfig.name,
  notificationText: '산책 기록 중 입니다...',
  debug: false,
  startOnBoot: false,
  stopOnTerminate: false,
  locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
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
        // console.log('geoComp:', location);
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
        if (error.message === 'Permission denied') {
          Alert.alert(
            '위치정보 권한 필요.',
            '소셜독은 앱이 백그라운드 및 항상 사용 중 일때 위치 정보를 수집하여 날씨 정보 및 산책기록 기능을 지원합니다.\n정상적인 서비스 이용을 위해서 위치정보 권한 설정이 필요합니다.\n설정화면으로 이동하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => {
                  Alert.alert(
                    '위치정보 권한 거절.',
                    '위치정보 권한설정을 거절하셨습니다. 설정을 원하실 경우 설정화면에서 다시 허용해주세요.',
                  );
                },
              },
              {
                text: '예',
                onPress: () => BackgroundGeolocation.showAppSettings(),
              },
            ],
          );
        } else {
          Alert.alert('오류가 발생했습니다.', '위치정보를 불러올 수 없습니다.');
        }
      },
    );
  };

  const initGeolocationData = () => {
    BackgroundGeolocation.checkStatus(
      data => {
        console.log(data);
        if (!data.authorization) {
          Alert.alert(
            '위치정보 권한 필요.',
            `소셜독은 앱이 백그라운드 및 항상 사용 중 일때 위치 정보를 수집하여 날씨 정보 및 산책기록 기능을 지원합니다.\n위치정보 권한을 허용해주세요.
            `,
            [
              {
                text: '아니요',
                onPress: () => {
                  mvGeolocationPermission(false);
                },
              },
              {text: '네', onPress: getLocation},
            ],
          );
        } else {
          mvGeolocationPermission(true);
          getData({key: LOCATION}).then(
            (data: {latitude: number; longitude: number}) => {
              if (data?.latitude && data?.longitude) {
                dispatch(setGeolocation({...data}));
              }
              getLocation();
            },
          );
        }
      },
      () => {
        Alert.alert('오류', '위치정보 권한 확인에 실패했습니다.');
      },
    );
  };

  useEffect(() => {
    BackgroundGeolocation.configure(geolocationConfig);
    initGeolocationData();
  }, []);

  return null;
}

export default GeolocationComponent;
