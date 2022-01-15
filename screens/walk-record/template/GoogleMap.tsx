import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import RNMapView, {Polyline} from 'react-native-maps';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import BackgroundTimer from 'react-native-background-timer';

interface latlngObj {
  latitude: number;
  longitude: number;
}

function GoogleMap() {
  const [useLocationManager] = useState(false);
  const [forceLocation] = useState(true);
  const [highAccuracy] = useState(true);
  const [locationDialog] = useState(true);
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [trackingPosition, setTrackingPosition] = useState(false);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow "social dog" to determine your location.',
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        console.log(position);
        setLocation(position);
        setLocations(prev =>
          prev.concat([
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ]),
        );
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

  const startTracking = () => {
    BackgroundTimer.setInterval(() => {
      getLocation();
    }, 6000);
  };

  const stopTracking = () => {
    BackgroundTimer.clearTimeout();
  };

  useEffect(() => {
    //getLocation();
  }, []);

  useEffect(() => {
    console.log(locations.length);
    console.log(locations);
  }, [locations]);

  return (
    <>
      {location && (
        <RNMapView
          style={{width: '100%', height: '70%'}}
          initialCamera={{
            altitude: 15000,
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            heading: 0,
            pitch: 0,
            zoom: 18,
          }}
          camera={{
            altitude: 15000,
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            heading: 0,
            pitch: 0,
            zoom: 18,
          }}>
          <Polyline
            coordinates={locations}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={6}
          />
        </RNMapView>
      )}
      <TouchableOpacity onPress={startTracking}>
        <Text>추적 시작</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopTracking}>
        <Text>추적 그만</Text>
      </TouchableOpacity>
    </>
  );
}

export default GoogleMap;
