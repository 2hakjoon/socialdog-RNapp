import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import ModalBackground from '../modal/ModalBackground';

function LoadingOverlay() {
  return (
    <ModalBackground closeModal={() => {}}>
      <View style={styles.wrapper}>
        <ActivityIndicator size={'large'} color="white" />
      </View>
    </ModalBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
  },
});

export default LoadingOverlay;
