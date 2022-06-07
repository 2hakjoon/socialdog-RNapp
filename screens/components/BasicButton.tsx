import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {colors} from '../../utils/colors';
import TextComp from './TextComp';

interface IBasicButton extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  disable?: boolean;
  fontColor?: string;
  fontWeight?: string;
  style?: {};
}

function BasicButton({
  title,
  onPress,
  disable = false,
  style,
  fontColor = 'white',
  fontWeight = '400',
}: IBasicButton) {
  return (
    <TouchableOpacity
      style={{
        ...(disable ? styles.disabledButton : styles.button),
        ...style,
      }}
      onPress={onPress}
      disabled={disable}>
      <TextComp text={title} color={fontColor} size={20} weight={fontWeight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.PBlue,
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.PLightGray,
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BasicButton;
