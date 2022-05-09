import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {setGeolocation} from '../../module/geolocation';
import {getData, storeData} from '../../utils/asyncStorage';

const LOCATION = 'LOCATION';

export const geolocationCofig = {
  //enableHighAccuracy: false,
  timeout: 2000,
  //maximumAge: 0,
};

function GeolocationComponent() {
  const dispatch = useDispatch();

  const getLocation = () => {
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
