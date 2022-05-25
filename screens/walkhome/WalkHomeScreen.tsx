import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {WalkHomeScreenProps} from '../../routes';
import {colors} from '../../utils/colors';
import Foundation from '../components/Icons/Foundation';
import TextComp from '../components/TextComp';
import WeatherCard from '../weather/template/WeatherCard';
import SelectDogTemplate from './template/SelectDogTemplate';

function WalkHomeScreen({navigation}: WalkHomeScreenProps) {
  const moveToRecord = () => {
    Alert.alert('산책시작', '산책을 시작하시겠습니까?', [
      {text: '아니요', onPress: () => {}},
      {text: '네', onPress: () => navigation.navigate('Record')},
    ]);
  };

  return (
    <View style={styles.wapper}>
      <View style={styles.weather}>
        <WeatherCard />
      </View>
      <View style={styles.dogProfile}>
        <SelectDogTemplate />
      </View>
      <View style={styles.bottomOutterWrapper}>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {
                navigation.navigate('WalkRecords');
              }}>
              <TextComp text="산책기록 보기" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => {
                moveToRecord();
              }}>
              <TextComp
                text="산책하러 가기"
                size={18}
                weight={'600'}
                color={colors.PBlue}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wapper: {
    flex: 1,
    backgroundColor: colors.PWhite,
  },
  weather: {
    flex: 1.4,
  },
  dogProfile: {
    flex: 6,
  },
  bottomOutterWrapper: {
    padding: 16,
    flex: 1,
  },
  bottomContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: 'white',
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
  buttonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export default WalkHomeScreen;
