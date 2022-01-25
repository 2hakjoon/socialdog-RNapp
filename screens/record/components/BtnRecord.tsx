import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import FdIcon from 'react-native-vector-icons/Foundation';
import OTIcon from 'react-native-vector-icons/Octicons';
import {theme} from '../../../utils/colors';
import TextComp from '../../components/TextComp';

const BtnWrapper = styled.View`
  height: 100px;
  width: 100px;
  border-radius: 50px;
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
      <BtnWrapper
        style={{
          //ios
          shadowOpacity: 0.25,
          shadowRadius: 13,
          shadowOffset: {
            height: 10,
            width: 0,
          },
          //android
          elevation: 20,
        }}>
        {recording || pause ? (
          <BtnInnerWrapper>
            <OTIcon name={'home'} size={50} color={theme.PBlue} />
            <TextComp text={'산책 종료'} />
          </BtnInnerWrapper>
        ) : (
          <BtnInnerWrapper>
            <FdIcon name={'guide-dog'} size={50} color={theme.PBlue} />
            <TextComp text={'산책 시작'} />
          </BtnInnerWrapper>
        )}
      </BtnWrapper>
    </TouchableOpacity>
  );
}

export default BtnRecord;
