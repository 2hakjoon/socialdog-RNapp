import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import RNMapView, {Polyline} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {walksCollection} from '../../firebase';
import {RootState} from '../../module';
import Geolocation from '@react-native-community/geolocation';

interface latlngObj {
  latitude: number;
  longitude: number;
}

function WalkRecordsScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(position);
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

  const loadRecordings = async () => {
    const res = await walksCollection
      .doc(user?.uid)
      .collection('2022-01-17')
      .get();
    res.forEach(doc => {
      console.log(doc.id);
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

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
        <Text>위치정보를 불러오는 중입니다.</Text>
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
        onPress={loadRecordings}>
        <Text>산책정보 불러오기</Text>
      </TouchableOpacity>
    </>
  );
}

export default WalkRecordsScreen;
