import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../module';
import {setGeolocation} from '../../module/geolocation';

function GeolocationComponent() {
  const geolocation = useSelector<RootState>(
    state => state.geolocation.geolocation,
  );
  const dispatch = useDispatch();

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

  useEffect(() => {
    getLocation();
  }, []);

  return null;
}

export default GeolocationComponent;
