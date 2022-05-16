import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNMapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {RootState} from '../../module';
import Geolocation from 'react-native-geolocation-service';
import LineCalendar from './components/LineCalendar';
import {useFocusEffect} from '@react-navigation/core';
import TextComp from '../components/TextComp';
import {
  formatAmPmHour,
  formatWalkingTime,
} from '../../utils/dataformat/timeformat';
import {colors} from '../../utils/colors';
import {gql, useLazyQuery, useQuery} from '@apollo/client';
import {now_yyyy_mm_dd} from '../../utils/dataformat/dateformat';
import {
  QGetWalks,
  QGetWalks_getWalks_data,
} from '../../__generated__/QGetWalks';
import {QGetWalk, QGetWalkVariables} from '../../__generated__/QGetWalk';
import {QMe} from '../../__generated__/QMe';
import {geolocationCofig} from '../components/GeolocationComponent';
import {GET_WALK_RECORD, GET_WALK_RECORDS} from '../../apollo-gqls/walks';
import {ME} from '../../apollo-gqls/auth';

interface latlngObj {
  latitude: number;
  longitude: number;
}

interface RecordData {
  [key: string]: [QGetWalks_getWalks_data];
}

function WalkRecordsScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [recordDays, setRecordDays] = useState<RecordData>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordList, setRecordList] = useState<QGetWalks_getWalks_data[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>('');
  const {data: meData} = useQuery<QMe>(ME);
  const user = meData?.me.data;
  const geolocaton = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );
  const refMapView = useRef<RNMapView>(null);

  const makeRecordsToDayes = (walkRecords: QGetWalks) => {
    let daysObj: RecordData = {};
    if (walkRecords.getWalks.data) {
      walkRecords.getWalks.data.forEach(record => {
        const date = now_yyyy_mm_dd(new Date(record.startTime * 1000));
        if (daysObj[`${date}`]) {
          daysObj[`${date}`].push({
            ...record,
          });
        } else {
          daysObj[`${date}`] = [
            {
              ...record,
            },
          ];
        }
      });
    }
    setRecordDays(daysObj);
  };

  const {data, loading, error} = useQuery<QGetWalks>(GET_WALK_RECORDS, {
    onCompleted: makeRecordsToDayes,
    fetchPolicy: 'network-only',
  });

  const [getWalkRecord] = useLazyQuery<QGetWalk, QGetWalkVariables>(
    GET_WALK_RECORD,
    {
      onCompleted: async data => {
        if (data.getWalk.data?.walkRecord) {
          setLocations(JSON.parse(data.getWalk.data?.walkRecord));
        }
      },
    },
  );

  const getLocation = () =>
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        // console.log(position);
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      geolocationCofig,
    );

  //키에 담긴 내용을 포멧팅해서 산책시작시간, 산책시간이 담긴 문자열로 리턴함
  const formatRcordKeyToTime = (startTime: number, walkingtime: number) => {
    // console.log(startTime);
    const startHour = new Date(startTime).getHours();
    const walkingTime = walkingtime;
    return `${formatAmPmHour(startHour)} ${formatWalkingTime(walkingTime)}`;
  };

  //날짜를 선택할때마다 해당 날짜의 산책데이터 리스트를 recordList에 넣어줌.
  useEffect(() => {
    if (selectedDate.trim()) {
      // console.log(recordDays, selectedDate);
      flatListScrollTop();
      setRecordList([...recordDays[selectedDate]]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRecord) {
      getWalkRecord({variables: {walkId: selectedRecord}});
    }
  }, [selectedRecord]);

  useFocusEffect(
    useCallback(() => {
      getLocation();
    }, []),
  );

  useEffect(() => {
    if (geolocaton?.latitude && geolocaton.longitude) {
      setLocation({...geolocaton});
    }
  }, []);

  // 산책기록이 선택되면, 해당 기록의 폴리라인 전체를 보여주게 카메라 이동.
  useEffect(() => {
    if (locations.length) {
      // 경로에 상관없이 좌표값을 오름차순으로 정렬함.
      const sortLat = locations
        .slice()
        .sort((a, b) => Number(a.latitude) - Number(b.latitude));
      const sortLong = locations
        .slice()
        .sort((a, b) => Number(a.longitude) - Number(b.longitude));

      // 가장 작은 좌표값과 가장 큰 좌표값의 차이를 구하고, 지도에 표시할때 여백을 위해 1.2를 곱함
      const latitudeDelta =
        Math.abs(sortLat[0].latitude - sortLat[sortLat.length - 1].latitude) *
        1.2;
      const longitudeDelta =
        Math.abs(
          sortLong[0].longitude - sortLong[sortLat.length - 1].longitude,
        ) * 1.2;

      // 카메라를 폴리라인의 중앙에 위치하기 위해 가장작은 좌표, 가장 큰 좌표의 중간점을 구해줌.
      // anmimateToRegion 함수를 이용해서 카메라를 이동.
      refMapView.current?.animateToRegion({
        latitude:
          (sortLat[0].latitude + sortLat[sortLat.length - 1].latitude) / 2,
        longitude:
          (sortLong[0].longitude + sortLong[sortLong.length - 1].longitude) / 2,
        latitudeDelta,
        longitudeDelta,
      });
    }
  }, [locations]);

  // console.log(recordDays);

  const flatListRef = useRef<FlatList>(null);

  const flatListScrollTop = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: false});
  };

  const walkItems = ({item}: any) => {
    const recordObj = item as QGetWalks_getWalks_data;
    return (
      <TouchableOpacity
        key={recordObj.id}
        onPress={() => setSelectedRecord(recordObj.id)}
        style={styles.recordBtn}>
        <TextComp
          text={formatRcordKeyToTime(
            recordObj.startTime,
            recordObj.walkingTime,
          )}
          color={colors.PWhite}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {location ? (
        <RNMapView
          ref={refMapView}
          provider={PROVIDER_GOOGLE}
          style={styles.mapContainer}
          initialCamera={{
            altitude: 15000,
            center: location,
            heading: 0,
            pitch: 0,
            zoom: 18,
          }}
          camera={{
            altitude: 15000,
            center: locations.length ? locations[0] : location,
            heading: 0,
            pitch: 0,
            zoom: 16,
          }}>
          <Polyline
            coordinates={locations}
            strokeColor={colors.PBlue} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={5}
            lineJoin={'miter'}
            lineCap={'round'}
          />
        </RNMapView>
      ) : (
        <Text style={styles.mapContainer}>위치정보를 불러오는 중입니다.</Text>
      )}
      <View style={styles.calendarContainer}>
        <>
          {recordDays && (
            <LineCalendar
              recordDays={recordDays}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
          <FlatList
            ref={flatListRef}
            data={recordList}
            renderItem={walkItems}
            keyExtractor={item => item.id}
            style={styles.recordListContainer}
            horizontal
            refreshing
          />
        </>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 7,
  },
  calendarContainer: {
    flex: 3,
  },
  recordListContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  recordBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PBlue,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 15,
  },
});

export default WalkRecordsScreen;
