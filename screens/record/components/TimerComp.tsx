import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {timerFormat} from '../../../utils/dataformat/timeformat';
import TextComp from '../../components/TextComp';

interface ITimerCompProps {
  recording: boolean;
  timer: number;
  setTimer: Function;
  pause: boolean;
}

function TimerComp({recording, timer, setTimer, pause}: ITimerCompProps) {
  useFocusEffect(
    useCallback(() => {
      if (recording && !pause) {
        setTimeout(() => {
          setTimer(timer + 1);
        }, 1000);
      }
    }, [timer, recording, pause]),
  );

  return (
    <View style={{width: 60}}>
      <TextComp text={timerFormat(timer)} size={16} />
    </View>
  );
}
export default TimerComp;
