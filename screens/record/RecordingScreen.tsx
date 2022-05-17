import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import RNMapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
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
import {
  geolocationCofig,
  hasLocationPermission,
} from '../components/GeolocationComponent';
import {ME} from '../../apollo-gqls/auth';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import appConfig from '../../app.json';
import {gpsFilter} from '../../App';

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
  const [mapZoom, setMapZoom] = useState<number>(18);
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>();
  const [timer, setTimer] = useState<number>(0);
  const [moveFastCount, setMoveFastCount] = useState(0);
  const {data} = useQuery<QMe>(ME);
  const user = data?.me.data;
  const geolocaton = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );

  const [createWalk, {error: createWalkError}] = useMutation<
    MCreateWalk,
    MCreateWalkVariables
  >(CREATE_WALK);

  const watchId = useRef(-1);

  const startRecording = async () => {
    setRecording(true);
    setStartTime(Date.now());
    gpsFilter.clearFilter();
    if (Platform.OS === 'android') {
      await startForegroundService();
    }
  };

  const toggleRecording = () => {
    setPause(prev => !prev);
  };

  const saveRecordingAndReset = async () => {
    try {
      const now = Date.now();
      const walkRecord = JSON.stringify(locations);

      if (!startTime) {
        throw new Error();
      }
      createWalk({
        variables: {
          startTime: trimMilSec(startTime),
          walkingTime: timer,
          finishTime: trimMilSec(now),
          walkRecord,
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
            removeLocationUpdates();
            saveRecordingAndReset();
          },
        },
      ],
    );
  };

  const startForegroundService = async () => {
    if (Platform.Version >= 26) {
      await VIForegroundService.createNotificationChannel({
        id: 'locationChannel',
        name: 'Location Tracking Channel',
        description: 'Tracks location of user',
        enableVibration: false,
        // importance: 5,
      });
    }

    return VIForegroundService.startService({
      channelId: 'locationChannel',
      id: 420,
      title: appConfig.displayName,
      text: '산책 기록중입니다.',
      icon: 'ic_launcher',
      // priority: 2,
    });
  };

  const stopForegroundService = useCallback(() => {
    if (Platform.OS === 'android') {
      VIForegroundService.stopService().catch((err: any) => console.log(err));
    }
  }, []);

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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
      error => {
        console.log(error);
      },
      geolocationCofig,
    );

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.clearWatch(watchId.current);

    watchId.current = Geolocation.watchPosition(
      position => {
        const [latitude, longitude] = gpsFilter.filterNewData([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        if (!pause && recording) {
          console.log(position);
          setLocations(prev => {
            const {latitude: prevLat, longitude: prevLong} =
              prev[prev.length - 1];

            // 소수점 5번째 자리는 1m
            // 5미터 이상 움직였을때만 기록.
            if (
              Math.abs(latitude - prevLat) + Math.abs(longitude - prevLong) >
              0.00008
            ) {
              // 1초안에 30미터 이상 움직인 데이터는 gps값이 튄것으로 판단.
              // 초속 5미터를 기준.
              if (
                Math.abs(latitude - prevLat) + Math.abs(longitude - prevLong) <
                0.0003
              ) {
                console.log('recorded');
                setMoveFastCount(0);
                return prev.concat([
                  {
                    latitude,
                    longitude,
                  },
                ]);
              } else {
                setMoveFastCount(prev => prev + 1);
              }
            }
            return prev;
          });
        }
        setLocation({
          latitude,
          longitude,
        });
        // console.log(position);
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 1000,
        fastestInterval: 500,
        // 아랫줄 코드 적용시 동작안함.
        // forceRequestLocation: true,
        // forceLocationManager: true,
        showLocationDialog: true,
        useSignificantChanges: false,
      },
    );
    // console.log(watchId);
  };

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== -1) {
      stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = -1;
    }
  }, [watchId]);

  useEffect(() => {
    if (geolocaton?.latitude && geolocaton.longitude) {
      setLocation({...geolocaton});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (recording) {
        getLocation();
      }
      getLocationUpdates();
      if (!recording) {
        getLocation();
      }
      return () => {
        stopForegroundService();
      };
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

  useEffect(() => {
    if (moveFastCount > 10) {
      removeLocationUpdates();
      saveRecordingAndReset();
      Alert.alert(
        '기록 종료',
        '자전거, 자동차를 탑승하신것으로 확인되어, 산책 기록을 종료힙니다.',
      );
    }
  }, [moveFastCount]);

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
