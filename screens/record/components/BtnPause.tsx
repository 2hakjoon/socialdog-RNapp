import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import FdIcon from 'react-native-vector-icons/Foundation';
import {theme} from '../../../utils/colors';
import TextComp from '../../components/TextComp';

const BtnWrapper = styled.View`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnInnerWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
      <BtnWrapper
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          //ios
          shadowOpacity: 0.25,
          shadowRadius: 13,
          shadowOffset: {
            height: 10,
            width: 0,
          },
          //android
          elevation: 20,
          opacity: recording || pause ? 1 : 0.5,
        }}>
        <BtnInnerWrapper>
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
        </BtnInnerWrapper>
      </BtnWrapper>
    </TouchableOpacity>
  );
}

export default BtnPause;
