import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import RNMapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

import BackgroundTimer from 'react-native-background-timer';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import BtnRecord from './components/BtnRecord';
import TimerComp from './components/TimerComp';
import BtnPause from './components/BtnPause';
import {timerFormatKor, trimMilSec} from '../../utils/dataformat/timeformat';
import {colors} from '../../utils/colors';
import {gql, useMutation} from '@apollo/client';
import {
  MCreateWalk,
  MCreateWalkVariables,
} from '../../__generated__/MCreateWalk';

interface latlngObj {
  latitude: number;
  longitude: number;
}

const CREATE_WALK = gql`
  mutation MCreateWalk(
    $walkingTime: Int!
    $startTime: Int!
    $finishTime: Int!
    $walkRecord: String!
  ) {
    createWalk(
      args: {
        walkingTime: $walkingTime
        startTime: $startTime
        finishTime: $finishTime
        walkRecord: $walkRecord
      }
    ) {
      ok
      error
    }
  }
`;

function RecordingScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [recordingId, setRecordingId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>();
  const [timer, setTimer] = useState<number>(0);
  const geolocaton = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );

  const [createWalk, {error: createWalkError}] = useMutation<
    MCreateWalk,
    MCreateWalkVariables
  >(CREATE_WALK);

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(!pause && recording);
        if (!pause && recording) {
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
      error => {},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

  const startRecording = () => {
    setRecording(true);
    setStartTime(Date.now());
  };

  const toggleRecording = () => {
    setPause(prev => !prev);
  };

  const saveRecordingAndReset = async () => {
    try {
      const now = Date.now();
      const walkRecord = JSON.stringify(locations);
      if (!startTime) throw new Error();
      console.log('힝구');
      createWalk({
        variables: {
          startTime: trimMilSec(startTime),
          walkingTime: timer + 1,
          finishTime: trimMilSec(now),
          walkRecord,
        },
      });
      setRecording(false);
      setPause(false);
      setTimer(0);
      setLocations([]);
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = () => {
    setPause(true);
    Alert.alert(
      '산책이 끝났나요?',
      `${timerFormatKor(timer + 1)} 동안 산책했어요.`,
      [
        {
          text: '아직이요',
          onPress: () => {
            setPause(false);
          },
          style: 'cancel',
        },
        {text: '끝났어요', onPress: () => saveRecordingAndReset()},
      ],
    );
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

      return () => {
        BackgroundTimer.clearInterval(recordingId);
      };
    }, [recording, pause]),
  );

  useFocusEffect(
    useCallback(() => {
      console.log(locations.length);
      console.log(locations);
    }, [locations]),
  );

  useEffect(() => {
    if (geolocaton?.latitude && geolocaton.longitude) {
      setLocation({...geolocaton});
    }
  }, []);
  return (
    <>
      {location ? (
        <RNMapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 7}}
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
            strokeColor={colors.PBlue} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={5}
          />
        </RNMapView>
      ) : (
        <View
          style={{
            flex: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>위치정보를 받아오는 중입니다....</Text>
        </View>
      )}
      <View style={styles.ButtonWrapper}>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ButtonWrapper: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
});

export default RecordingScreen;
