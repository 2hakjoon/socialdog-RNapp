import React, {useCallback, useEffect, useState} from 'react';
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
import {recordsCollection, walksCollection} from '../../firebase';
import {RootState} from '../../module';
import Geolocation from '@react-native-community/geolocation';
import LineCalendar from './components/LineCalendar';
import {useFocusEffect} from '@react-navigation/core';
import TextComp from '../components/TextComp';
import {
  formatAmPmHour,
  formatWalkingTime,
} from '../../utils/dataformat/timeformat';
import {colors} from '../../utils/colors';
import {gql, useQuery} from '@apollo/client';
import {
  Q_WALK_RECORDS,
  Q_WALK_RECORDS_getWalks_data,
} from '../../__generated__/Q_WALK_RECORDS';
import {authHeader} from '../../utils/dataformat/graphqlHeader';
import {now_yyyy_mm_dd} from '../../utils/dataformat/dateformat';

interface latlngObj {
  latitude: number;
  longitude: number;
}

interface ReocordType {
  startTime: number;
  finishiTime: number;
  walkingTime: number;
  id: number;
}

interface RecordData {
  [key: string]: [ReocordType];
}

const GET_WALK_RECORDS = gql`
  query Q_WALK_RECORDS {
    getWalks {
      ok
      data {
        walkingTime
        startTime
        finishTime
        id
      }
    }
  }
`;

function WalkRecordsScreen() {
  const [location, setLocation] = useState<latlngObj | null>(null);
  const [locations, setLocations] = useState<latlngObj[]>([]);
  const [recordDays, setRecordDays] = useState<RecordData>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordList, setRecordList] = useState<ReocordType[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);
  const geolocaton = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );

  const makeRecordsToDayes = (walkRecords: Q_WALK_RECORDS) => {
    console.log(walkRecords);
    let daysObj: RecordData = {};
    if (walkRecords.getWalks.data) {
      walkRecords.getWalks.data.forEach(record => {
        const date = now_yyyy_mm_dd(new Date(record.startTime * 1000));
        if (daysObj[`${date}`]) {
          daysObj[`${date}`].push({
            startTime: record.startTime,
            walkingTime: record.walkingTime,
            finishiTime: record.finishTime,
            id: record.id,
          });
        } else {
          daysObj[`${date}`] = [
            {
              startTime: record.startTime,
              walkingTime: record.walkingTime,
              finishiTime: record.finishTime,
              id: record.id,
            },
          ];
        }
      });
    }
    console.log(daysObj);
    setRecordDays(daysObj);
  };

  const {data, loading, error} = useQuery<Q_WALK_RECORDS>(GET_WALK_RECORDS, {
    ...authHeader(user?.accessToken),
    onCompleted: makeRecordsToDayes,
  });
  console.log(data, loading, error);

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

  const recordToPolyLine = async (key: string) => {
    const record = await (
      await recordsCollection.doc(`${user?.id}-${key}`).get()
    ).data();
    if (record) {
      console.log(Object.values(record));
      setLocations(Object.values(record));
    }
  };

  //firbase의 키에 담긴 내용을 포멧팅해서 산책시작시간, 산책시간이 담긴 문자열로 리턴함
  const formatRcordKeyToTime = (key: string) => {
    console.log(key);
    const startTime = new Date(+key.split('-')[0]).getHours();
    const walkingTime = +key.split('-')[2];
    return `${formatAmPmHour(startTime)} ${formatWalkingTime(walkingTime)}`;
  };

  //날짜를 선택할때마다 해당 날짜의 산책데이터 리스트를 recordList에 넣어줌.
  useEffect(() => {
    if (selectedDate.trim()) {
      setRecordList([...recordDays[selectedDate]]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRecord.trim()) {
      recordToPolyLine(selectedRecord);
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

  console.log(recordDays);

  return (
    <>
      {location ? (
        <RNMapView
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
            zoom: 17,
          }}>
          <Polyline
            coordinates={locations}
            strokeColor={colors.PBlue} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={5}
            lineJoin={'round'}
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
          <ScrollView style={styles.recordListContainer} horizontal>
            {recordList.map(key => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedRecord(key)}
                  style={styles.recordBtn}>
                  <TextComp
                    text={formatRcordKeyToTime(key)}
                    color={colors.PWhite}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
