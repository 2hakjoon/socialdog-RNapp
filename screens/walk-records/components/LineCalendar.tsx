import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Dimensions} from 'react-native';
import {colors} from '../../../utils/colors';
import {now_yyyy_mm_dd} from '../../../utils/dataformat/dateformat';
import {Oneday} from '../../../utils/dataformat/timeformat';
import TextComp from '../../components/TextComp';
import {IRecordData} from '../WalkRecordsScreen';

const width = Dimensions.get('window').width; //full width

interface ILineCalendar {
  recordDays: IRecordData;
  selectedDate: string;
  setSelectedDate: Function;
}

function LineCalendar({
  recordDays,
  selectedDate,
  setSelectedDate,
}: ILineCalendar) {
  const [days, setDays] = useState<string[]>([]);

  const getLast7days = () => {
    const startDate = new Date(Date.now() + Oneday);
    //map함수 내에서 코드를 짧게 쓰기위해 오늘 + 1일을 초기값을 할당.
    const weekArray = Array.from({length: 7})
      .map(() => {
        return now_yyyy_mm_dd(
          new Date(startDate.setDate(startDate.getDate() - 1)),
        );
      })
      .reverse();
    setDays([...weekArray]);
  };

  const checkWalkDate = (day: string) => {
    return recordDays[day]?.length > 0;
  };

  useFocusEffect(
    useCallback(() => {
      getLast7days();
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      <>
        <TextComp
          text={'최근 일주일 기록'}
          size={22}
          color={colors.PBlack}
          style={{paddingLeft: 10, paddingBottom: 10}}
        />
        <View style={styles.calendarContainer}>
          {days.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedDate(day)}
              disabled={!checkWalkDate(day)}
              style={styles.blockContainer}>
              <View
                style={
                  selectedDate === day
                    ? styles.roundBackgrondHighlight
                    : styles.roundBackgrond
                }>
                <TextComp
                  color={
                    checkWalkDate(day)
                      ? selectedDate === day
                        ? colors.PWhite
                        : colors.PBlack
                      : colors.PDarkGray
                  }
                  text={day.split('-')[2]}
                  size={20}
                />
              </View>
              {checkWalkDate(day) && <View style={styles.roundDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 2,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  calendarContainer: {
    height: '50%',
    flexDirection: 'row',
    alignContent: 'stretch',
  },
  blockContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width / 7,
  },
  roundBackgrondHighlight: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.PBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBackgrond: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.PWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.PBlue,
    borderRadius: 5,
  },
});

export default LineCalendar;
