import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import RNMapView, {Polyline} from 'react-native-maps';

import BackgroundTimer from 'react-native-background-timer';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../module';
import {now_yyyy_mm_dd} from '../../../utils/dataformat/dateformat';
import {walksCollection} from '../../../firebase';

interface latlngObj {
  latitude: number;
  longitude: number;
}

function GoogleMap() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [trackingId, setTrackingId] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [startTime, setStartTime] = useState<number>();
  const user = useSelector((state: RootState) => state.auth.user);

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(tracking);
        if (tracking) {
          setLocations(prev =>
            prev.concat([
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            ]),
          );
        }
        console.log(position);
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

  const startTracking = () => {
    setTracking(true);
    setStartTime(Date.now());
  };

  const stopTracking = () => {
    setTracking(false);
  };

  const saveTracking = () => {
    setTracking(false);
    walksCollection
      .doc(user?.uid)
      .collection(now_yyyy_mm_dd())
      .doc(`${startTime}-${Date.now()}`)
      .set({locations})
      .then(() => {
        console.log('walks added!');
      });
  };

  const watchUserLocation = () => {
    BackgroundTimer.clearInterval(trackingId);
    const intervalId = BackgroundTimer.setInterval(() => {
      getLocation();
    }, 3000);
    setTrackingId(intervalId);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        BackgroundTimer.clearInterval(trackingId);
      };
    }, [trackingId]),
  );

  useFocusEffect(
    useCallback(() => {
      if (tracking) {
        getLocation();
      }
      watchUserLocation();
      if (!tracking) {
        getLocation();
      }
    }, [tracking]),
  );

  useFocusEffect(
    useCallback(() => {
      console.log(locations.length);
      console.log(locations);
    }, [locations]),
  );

  return (
    <>
      {location ? (
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
      ) : (
        <View
          style={{
            width: '100%',
            height: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>위치정보를 받아오는 중입니다....</Text>
        </View>
      )}
      <TouchableOpacity
        style={{
          width: '100%',
          height: 30,
          backgroundColor: 'skyblue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 5,
        }}
        onPress={tracking ? saveTracking : startTracking}>
        <Text>{tracking ? '산책 종료' : '산책 시작'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 30,
          backgroundColor: 'skyblue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 5,
        }}
        onPress={stopTracking}>
        <Text>잠깐 휴식</Text>
      </TouchableOpacity>
    </>
  );
}

export default GoogleMap;
