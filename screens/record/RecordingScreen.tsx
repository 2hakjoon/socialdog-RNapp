import React, {useCallback, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import RNMapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

import BackgroundTimer from 'react-native-background-timer';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import {now_yyyy_mm_dd} from '../../utils/dataformat/dateformat';
import {recordsCollection, walksCollection} from '../../firebase';
import styled from 'styled-components/native';
import BtnRecord from './components/BtnRecord';
import TimerComp from './components/TimerComp';
import BtnPause from './components/BtnPause';
import {timerFormatKor} from '../../utils/dataformat/timeformat';

interface latlngObj {
  latitude: number;
  longitude: number;
}

const ButtonWrapper = styled.View`
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: white;
`;

function RecordingScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [recordingId, setRecordingId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>();
  const [timer, setTimer] = useState<number>(0);
  const user = useSelector((state: RootState) => state.auth.user);

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(recording);
        if (recording) {
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

  const startRecording = () => {
    setRecording(true);
    setStartTime(Date.now());
  };

  const toggleRecording = () => {
    setPause(prev => !prev);
    setRecording(prev => !prev);
  };

  const saveRecordingAndReset = async () => {
    const now = Date.now();
    const recordingUid = `${user?.uid}-${startTime}-${now}`;
    await recordsCollection.doc(recordingUid).set({
      ...locations,
    });

    const todayRecords = await (
      await walksCollection.doc(user?.uid).get()
    ).data();
    console.log(todayRecords);
    const walkRecordKey = `${startTime}-${now}-${timer}`;

    if (todayRecords && todayRecords[`${now_yyyy_mm_dd()}`]?.length) {
      walksCollection.doc(user?.uid).update({
        [`${now_yyyy_mm_dd()}`]: [
          ...todayRecords[`${now_yyyy_mm_dd()}`],
          walkRecordKey,
        ],
      });
    } else {
      walksCollection
        .doc(user?.uid)
        .update({[`${now_yyyy_mm_dd()}`]: [walkRecordKey]});
    }
    setRecording(false);
    setPause(false);
    setTimer(0);
    setLocations([]);
  };

  const createSaveAlert = () =>
    Alert.alert('산책이 끝나셨나요?', `${timerFormatKor(timer + 1)}`, [
      {
        text: '아직이요!',
        onPress: () => {
          setPause(false);
        },
        style: 'cancel',
      },
      {text: '끝났어요', onPress: () => saveRecordingAndReset()},
    ]);

  const stopRecording = async () => {
    setPause(true);
    createSaveAlert();
  };

  const watchUserLocation = () => {
    BackgroundTimer.clearInterval(recordingId);
    const intervalId = BackgroundTimer.setInterval(() => {
      getLocation();
    }, 3000);
    setRecordingId(intervalId);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        BackgroundTimer.clearInterval(recordingId);
      };
    }, [recordingId]),
  );

  useFocusEffect(
    useCallback(() => {
      if (recording) {
        getLocation();
      }
      watchUserLocation();
      if (!recording) {
        getLocation();
      }
    }, [recording]),
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
      <ButtonWrapper>
        <TimerComp
          recording={recording}
          pause={pause}
          timer={timer}
          setTimer={setTimer}
        />
        <BtnRecord
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          pause={pause}
        />
        <BtnPause
          toggleRecording={toggleRecording}
          pause={pause}
          recording={recording}
        />
      </ButtonWrapper>
    </>
  );
}

export default RecordingScreen;
