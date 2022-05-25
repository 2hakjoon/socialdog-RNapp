import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {colors} from '../../../utils/colors';

interface IDogProfilePhoto {
  size: number;
  url?: string;
}

function DogProfilePhoto({size, url}: IDogProfilePhoto) {
  return (
    <View style={{...styles.imgWrapper, width: size * 1.2, height: size * 1.2}}>
      {url ? (
        <Image
          style={{...styles.dogImg, width: size, height: size}}
          source={{uri: url}}
        />
      ) : (
        <Image
          style={{...styles.dogImg, width: size, height: size}}
          source={require('../../../assets/png/dog_default_photo.png')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imgWrapper: {
    width: 200,
    height: 200,
    borderWidth: 6,
    borderColor: colors.PDarkGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
  },
  dogImg: {
    opacity: 0.5,
    width: 150,
    height: 150,
  },
});

export default DogProfilePhoto;
