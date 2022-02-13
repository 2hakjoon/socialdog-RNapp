import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {colors} from '../../utils/colors';
import TextComp from './TextComp';

interface ISmallButton extends TouchableOpacityProps {
  title: string;
  style?: {};
}

function SmallButton({
  title,
  onPress,
  disabled = false,
  style = {},
}: ISmallButton) {
  return (
    <TouchableOpacity
      style={{...styles.default, ...(!disabled && styles.disable), ...style}}
      onPress={onPress}
      disabled={disabled}>
      <TextComp text={title} color="white" size={15} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PBlue,
  },
  disable: {
    backgroundColor: colors.PLightGray,
  },
});

export default SmallButton;
