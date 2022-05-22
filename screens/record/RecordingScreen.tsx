import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import RNMapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import BtnRecord from './components/BtnRecord';
import TimerComp from './components/TimerComp';
import BtnPause from './components/BtnPause';
import {timerFormatKor, trimMilSec} from '../../utils/dataformat/timeformat';
import {colors} from '../../utils/colors';
import {gql, useMutation, useQuery} from '@apollo/client';
import {
  MCreateWalk,
  MCreateWalkVariables,
} from '../../__generated__/MCreateWalk';
import Foundation from '../components/Icons/Foundation';
import {QMe} from '../../__generated__/QMe';
import ProfilePhoto from '../components/ProfilePhoto';
import {ME} from '../../apollo-gqls/auth';
import {gpsFilter} from '../../App';
import * as lzstring from 'lz-string';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import TextComp from '../components/TextComp';
import {geolocationConfig} from '../components/GeolocationComponent';

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
  const [mapZoom, setMapZoom] = useState<number>(17);
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>();
  const [timer, setTimer] = useState<number>(0);
  const {data} = useQuery<QMe>(ME);
  const user = data?.me.data;
  const geolocaton = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );

  const [createWalk, {error: createWalkError}] = useMutation<
    MCreateWalk,
    MCreateWalkVariables
  >(CREATE_WALK);

  const startRecording = async () => {
    setRecording(true);
    setStartTime(Date.now());
    gpsFilter.clearFilter();
    startForegroundNotification();
  };

  const toggleRecording = () => {
    setPause(prev => !prev);
  };

  const saveRecordingAndReset = async () => {
    try {
      const now = Date.now();
      // 기록의 사이즈를 줄이기 위해 키를 제거함.
      const simplifiedRecord = locations.map(val => [
        +val.latitude.toFixed(6),
        +val.longitude.toFixed(6),
      ]);
      //console.log(simplifiedRecord);

      // 압축하기 전에, 배열을 문자열로 변경함
      const stringData = JSON.stringify(simplifiedRecord);

      // 압축.
      const compressed = lzstring.compressToEncodedURIComponent(stringData);
      if (!startTime) {
        throw new Error();
      }
      createWalk({
        variables: {
          startTime: trimMilSec(startTime),
          walkingTime: timer,
          finishTime: trimMilSec(now),
          walkRecord: compressed,
        },
      });
      setRecording(false);
      setPause(false);
      setTimer(0);
      setLocations([]);
      gpsFilter.clearFilter();
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = () => {
    setPause(true);
    Alert.alert(
      '산책이 끝났나요?',
      `${timerFormatKor(timer)} 동안 산책했어요.`,
      [
        {
          text: '아직이요',
          onPress: () => {
            setPause(false);
          },
          style: 'cancel',
        },
        {
          text: '끝났어요',
          onPress: () => {
            saveRecordingAndReset();
            stopForegroundNotification();
          },
        },
      ],
    );
  };

  const startGeolocationSubscribe = async () => {
    BackgroundGeolocation.start();
  };

  const removeGeolocationListener = useCallback(() => {
    BackgroundGeolocation.removeAllListeners();
  }, []);

  const startForegroundNotification = useCallback(() => {
    BackgroundGeolocation.configure({
      ...geolocationConfig,
      startForeground: true,
      notificationsEnabled: true,
    });
  }, []);
  const stopForegroundNotification = useCallback(() => {
    BackgroundGeolocation.configure({
      ...geolocationConfig,
      startForeground: false,
      notificationsEnabled: false,
    });
  }, []);

  const getLocation = () =>
    BackgroundGeolocation.getCurrentLocation(
      location => {
        setLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        if (!pause && recording) {
          setLocations(prev =>
            prev.concat([
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            ]),
          );
        }
        console.log(location);
      },
      error => {
        console.log(error);
      },
    );

  useEffect(() => {
    if (geolocaton?.latitude && geolocaton.longitude) {
      setLocation({...geolocaton});
    }
  }, []);

  useEffect(() => {
    startGeolocationSubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (recording) {
        getLocation();
      }
      if (!recording) {
        getLocation();
      }
      BackgroundGeolocation.removeAllListeners();
      BackgroundGeolocation.on('location', location => {
        console.log(Platform.OS, location);

        const [latitude, longitude] = gpsFilter.filterNewData([
          location.latitude,
          location.longitude,
        ]);

        if (!pause && recording) {
          setLocations(prev => {
            return prev.concat([
              {
                latitude,
                longitude,
              },
            ]);
          });
        }
        setLocation({
          latitude,
          longitude,
        });
        // console.log(position);

        // handle your locations here
        // to perform long running operation on iOS
        // you need to create background task
        BackgroundGeolocation.startTask(taskKey => {
          // execute long running task
          // eg. ajax post location
          // IMPORTANT: task has to be ended by endTask
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    }, [recording, pause]),
  );

  useFocusEffect(
    useCallback(() => {
      if (timer > 10800) {
        saveRecordingAndReset();
        Alert.alert('산책 종료', '최대 산책가능시간은 3시간입니다 :(');
      }
    }, [timer]),
  );

  return (
    <>
      {location ? (
        <RNMapView
          onRegionChangeComplete={region => {
            setMapZoom(
              Math.ceil(Math.log(360 / region.longitudeDelta) / Math.LN2),
            );
          }}
          onPanDrag={e => console.log(e.target)}
          provider={PROVIDER_GOOGLE}
          style={{flex: 7}}
          initialCamera={{
            altitude: 15000,
            center: location,
            heading: 0,
            pitch: 0,
            zoom: mapZoom,
          }}
          camera={{
            altitude: 15000,
            center: location,
            heading: 0,
            pitch: 0,
            zoom: mapZoom,
          }}>
          <Marker coordinate={location} anchor={{x: 0.5, y: 0.5}}>
            <View style={styles.walkMarker}>
              {user?.photo ? (
                <ProfilePhoto url={user.photo} />
              ) : (
                <Foundation name="guide-dog" size={30} />
              )}
            </View>
          </Marker>
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
  markerWrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  walkMarker: {
    overflow: 'hidden',
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: colors.PBlue,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecordingScreen;
