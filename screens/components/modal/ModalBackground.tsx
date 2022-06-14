import React, {ReactNode} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface IModalBackground {
  children: ReactNode;
  closeModal: () => void;
}

function ModalBackground({children, closeModal}: IModalBackground) {
  return (
    <TouchableOpacity
      onPress={closeModal}
      activeOpacity={1}
      style={styles.wrapper}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalBackground;
