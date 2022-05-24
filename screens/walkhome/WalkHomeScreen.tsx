import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {WalkHomeScreenProps} from '../../routes';
import {colors} from '../../utils/colors';
import Foundation from '../components/Icons/Foundation';
import TextComp from '../components/TextComp';
import WeatherCard from '../weather/template/WeatherCard';
import SelectDogTemplate from './template/SelectDogTemplate';

function WalkHomeScreen({navigation}: WalkHomeScreenProps) {
  return (
    <View style={styles.wapper}>
      <View style={styles.weather}>
        <WeatherCard />
      </View>
      <View style={styles.dogProfile}>
        <SelectDogTemplate />
      </View>
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
              navigation.navigate('Record');
            }}>
            <TextComp text="산책하러 가기" size={18} />
          </TouchableOpacity>
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
    flex: 1.2,
  },
  dogProfile: {
    flex: 6,
  },
  bottomContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: colors.PLightGray,
  },
  buttonContainer: {
    width: '100%',
    marginLeft: 'auto',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default WalkHomeScreen;
