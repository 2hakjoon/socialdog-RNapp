import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FdIcon from 'react-native-vector-icons/Foundation';
import OTIcon from 'react-native-vector-icons/Octicons';
import {colors} from '../../../utils/colors';
import TextComp from '../../components/TextComp';

interface IBtnRecordProps {
  recording: boolean;
  pause: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<void>;
}

function BtnRecord({
  recording,
  startRecording,
  stopRecording,
  pause,
}: IBtnRecordProps) {
  return (
    <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
      <View style={styles.BtnWrapper}>
        {recording || pause ? (
          <View>
            <OTIcon
              name={'home'}
              size={50}
              color={colors.PBlue}
              style={{marginLeft: 2}}
            />
            <TextComp text={'산책 종료'} />
          </View>
        ) : (
          <View>
            <FdIcon
              name={'guide-dog'}
              size={50}
              color={colors.PBlue}
              style={{marginLeft: 8}}
            />
            <TextComp text={'산책 시작'} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  BtnWrapper: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    //ios
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 13,
        shadowOffset: {
          height: 10,
          width: 0,
        },
      },
      //android
      android: {
        elevation: 20,
      },
    }),
  },
  BtnInnerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BtnRecord;
