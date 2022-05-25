import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {colors} from '../../../utils/colors';
import BasicButton from '../../components/BasicButton';
import TextComp from '../../components/TextComp';

function SelectDogTemplate() {
  return (
    <View style={styles.wapper}>
      <View style={styles.InnerWrapper}>
        <View style={styles.imgWrapper}>
          <Image
            style={styles.dogImg}
            source={require('../../../assets/png/dog_default_photo.png')}
          />
        </View>
        <View style={styles.textWrappr}>
          <TextComp text={'반려견의 프로필을 등록할 수 있어요!'} />
        </View>
        <View style={styles.buttonWrapper}>
          <BasicButton title="반려견 등록하기" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wapper: {padding: 16},
  InnerWrapper: {
    paddingVertical: 30,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: '100%', //ios
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 30,
        shadowOffset: {
          height: 15,
          width: 0,
        },
      },
      //android
      android: {
        elevation: 5,
      },
    }),
  },
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
  textWrappr: {
    paddingTop: 60,
  },
  buttonWrapper: {
    paddingTop: 40,
    width: '60%',
  },
});
export default SelectDogTemplate;
