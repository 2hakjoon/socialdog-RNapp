import React, {ReactNode} from 'react';
import {StyleSheet, Touchable, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';

interface IModalBackground {
  children: ReactNode;
  closeModal: () => void;
}

function ModalBackground({children, closeModal}: IModalBackground) {
  return (
    <TouchableOpacity onPress={closeModal} style={styles.wrapper}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalBackground;
