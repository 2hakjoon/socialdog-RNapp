import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNMapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
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

  const makeRecordsToDayes = (walkRecords: QGetWalks) => {
    // console.log(walkRecords);
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
    nextFetchPolicy: 'cache-first',
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

  //firbase의 키에 담긴 내용을 포멧팅해서 산책시작시간, 산책시간이 담긴 문자열로 리턴함
  const formatRcordKeyToTime = (startTime: number, walkingtime: number) => {
    console.log(startTime);
    const startHour = new Date(startTime).getHours();
    const walkingTime = walkingtime;
    return `${formatAmPmHour(startHour)} ${formatWalkingTime(walkingTime)}`;
  };

  //날짜를 선택할때마다 해당 날짜의 산책데이터 리스트를 recordList에 넣어줌.
  useEffect(() => {
    if (selectedDate.trim()) {
      console.log(recordDays, selectedDate);
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
            {recordList.map(recordObj => {
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
