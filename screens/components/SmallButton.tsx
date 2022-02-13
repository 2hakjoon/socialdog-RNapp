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
  disable?: boolean | undefined;
  style?: {};
}

function SmallButton({
  title,
  onPress,
  disable = false,
  style = {},
}: ISmallButton) {
  return (
    <TouchableOpacity
      style={{...styles.default, ...(!disable && styles.disable), ...style}}
      onPress={onPress}
      disabled={disable}>
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
