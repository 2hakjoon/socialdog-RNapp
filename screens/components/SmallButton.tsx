import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import TextComp from './TextComp';

interface ISmallButton {
  title: string;
  onPress: () => void;
  disable?: boolean;
}

function SmallButton({title, onPress, disable = false}: ISmallButton) {
  return (
    <TouchableOpacity
      style={disable ? styles.disabledButton : styles.button}
      onPress={onPress}
      disabled={disable}>
      <TextComp text={title} color="white" size={15} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.PBlue,
    width: 40,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.PLightGray,
    width: 40,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SmallButton;
