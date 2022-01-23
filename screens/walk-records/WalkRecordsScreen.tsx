import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, Text, TouchableOpacity} from 'react-native';
import RNMapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {recordsCollection, walksCollection} from '../../firebase';
import {RootState} from '../../module';
import Geolocation from '@react-native-community/geolocation';
import styled from 'styled-components/native';

const StyledView = styled.View`
  background-color: ${({theme}) => theme.PBlue};
  height: 100%;
  width: 100%;
`;

interface latlngObj {
  latitude: number;
  longitude: number;
}

interface ArrayLikeType {
  [key: string]: Object[];
}

function WalkRecordsScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [recordDays, setRecordDays] = useState<ArrayLikeType>({});
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

  const loadRecordedDays = async () => {
    const recordDayLists = await (
      await walksCollection.doc(user?.uid).get()
    ).data();
    if (recordDayLists) {
      setRecordDays(recordDayLists);
    }
  };

  const recordToPolyLine = async (date: string) => {
    console.log(date);
    console.log(recordDays[date][0]);
    const record = await (
      await recordsCollection.doc(`${user?.uid}-${recordDays[date][0]}`).get()
    ).data();
    if (record) {
      console.log(Object.values(record));
      setLocations(Object.values(record));
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      {location ? (
        <RNMapView
        provider={PROVIDER_GOOGLE}
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
        <Text style={{width: '100%', height: '70%'}}>
          위치정보를 불러오는 중입니다.
        </Text>
      )}
      <TouchableOpacity
        style={{
          width: '100%',
          height: 30,
          backgroundColor: 'skyblue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 5,
        }}
        onPress={loadRecordedDays}>
        <Text>산책정보 불러오기</Text>
      </TouchableOpacity>
      <StyledView>
        <ScrollView>
          {Object.keys(recordDays).map((date, idx) => {
            return (
              <Button
                key={idx}
                onPress={() => recordToPolyLine(date)}
                title={date}
              />
            );
          })}
        </ScrollView>
      </StyledView>
    </>
  );
}

export default WalkRecordsScreen;
