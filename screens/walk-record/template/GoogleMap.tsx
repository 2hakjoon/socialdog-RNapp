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

import BackgroundTimer from 'react-native-background-timer';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

interface latlngObj {
  latitude: number;
  longitude: number;
}

function GoogleMap() {
  const [useLocationManager] = useState(false);
  const [forceLocation] = useState(true);
  const [highAccuracy] = useState(true);
  const [locationDialog] = useState(true);
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocations(prev =>
          prev.concat([
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          ]),
        );
        console.log(position);
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const startTracking = () => {
    BackgroundTimer.setInterval(() => {
      getLocation();
    }, 6000);
  };

  const stopTracking = () => {
    BackgroundTimer.clearInterval();
  };

  useEffect(() => {
    getLocation();
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
            center: location,
            heading: 0,
            pitch: 0,
            zoom: 18,
          }}
          camera={{
            altitude: 15000,
            center: location,
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
