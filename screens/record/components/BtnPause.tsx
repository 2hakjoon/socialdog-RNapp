import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import FdIcon from 'react-native-vector-icons/Foundation';
import {theme} from '../../../utils/colors';

interface IBtnPauseProps {
  recording: boolean;
  pause: boolean;
  toggleRecording: () => void;
}

function BtnPause({toggleRecording, pause, recording}: IBtnPauseProps) {
  return (
    <TouchableOpacity
      disabled={!(recording || pause)}
      onPress={toggleRecording}>
      <View
        style={{
          ...styles.BtnWrapper,
          opacity: recording || pause ? 1 : 0.5,
        }}>
        <View style={styles.BtnInnerWrapper}>
          {pause ? (
            <FdIcon
              name={'play'}
              size={50}
              color={theme.PBlue}
              style={{marginLeft: 7}}
            />
          ) : (
            <FdIcon name={'pause'} size={50} color={theme.PBlue} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  BtnWrapper: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
  // const BtnWrapper = styled.View`
  // height: 60px;
  // width: 60px;
  // border-radius: 30px;
  // background-color: white;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // `;

  // const BtnInnerWrapper = styled.View`
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // `;
});

export default BtnPause;
