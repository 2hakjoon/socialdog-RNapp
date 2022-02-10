import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import TextComp from './TextComp';

interface IBasicButton {
  title: string;
  onPress: () => void;
}

function BasicButton({title, onPress}: IBasicButton) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <TextComp text={title} color="white" size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.PBlue,
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BasicButton;
