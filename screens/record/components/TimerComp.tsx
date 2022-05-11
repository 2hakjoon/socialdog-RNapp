import {useFocusEffect} from '@react-navigation/core';
import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import {View} from 'react-native';
import {timerFormat} from '../../../utils/dataformat/timeformat';
import TextComp from '../../components/TextComp';
import BackgroundTimer from 'react-native-background-timer';

interface ITimerCompProps {
  recording: boolean;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  pause: boolean;
}

function TimerComp({recording, timer, setTimer, pause}: ITimerCompProps) {
  const [timerIntervalId, setTimerIntervalId] = useState(-1);

  const clearTimer = () => {
    stopBackgroundTimer();
    setTimer(0);
  };

  const stopBackgroundTimer = () => {
    // console.log('timerIntervalId:', timerIntervalId);
    BackgroundTimer.clearInterval(timerIntervalId);
  };

  const startBackgroundTimer = () => {
    stopBackgroundTimer();
    const timerId = BackgroundTimer.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerIntervalId(timerId);
  };

  useFocusEffect(
    useCallback(() => {
      // console.log('recording:', recording, 'pause:', pause);
      if (recording && !pause) {
        startBackgroundTimer();
      } else if (recording && pause) {
        stopBackgroundTimer();
      } else if (!recording) {
        clearTimer();
      }
    }, [recording, pause]),
  );

  return (
    <View style={{width: 60}}>
      <TextComp text={timerFormat(timer)} size={16} />
    </View>
  );
}
export default TimerComp;
