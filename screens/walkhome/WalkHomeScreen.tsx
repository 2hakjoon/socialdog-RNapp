import {useReactiveVar} from '@apollo/client';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {mvGeolocationPermission, TypenameAndId} from '../../apollo-setup';
import {WalkHomeScreenProps} from '../../routes';
import {colors} from '../../utils/colors';
import LoadingOverlay from '../components/loading/LoadingOverlay';
import TextComp from '../components/TextComp';
import WeatherCard from '../weather/template/WeatherCard';
import SelectDogTemplate from './template/SelectDogTemplate';

function WalkHomeScreen({navigation}: WalkHomeScreenProps) {
  const [selectedDogId, setSeletedDogId] = useState<
    TypenameAndId | undefined
  >();

  const geolocationPermission = useReactiveVar(mvGeolocationPermission);

  const moveToRecord = () => {
    if (geolocationPermission) {
      Alert.alert('산책시작', '산책을 시작하시겠습니까?', [
        {text: '아니요', onPress: () => {}},
        {
          text: '네',
          onPress: () => navigation.navigate('Record', selectedDogId),
        },
      ]);
    } else {
      Alert.alert(
        '위치정보 권한 필요.',
        '소셜독은 앱이 백그라운드 및 항상 사용 중 일때 위치 정보를 수집하여 날씨 정보 및 산책기록 기능을 지원합니다.\n정상적인 서비스 이용을 위해서 위치정보 권한 설정이 필요합니다.\n설정화면으로 이동하시겠습니까?',
        [
          {
            text: '아니요',
            onPress: () => {
              Alert.alert(
                '위치정보 권한 거절.',
                '위치정보 권한설정을 거절하셨습니다. 설정을 원하실 경우 설정화면에서 다시 허용해주세요.',
              );
            },
          },
          {
            text: '예',
            onPress: () => BackgroundGeolocation.showAppSettings(),
          },
        ],
      );
    }
  };
  return (
    <View style={styles.wapper}>
      <View style={styles.weather}>
        <WeatherCard />
      </View>
      <View style={styles.dogProfile}>
        <SelectDogTemplate setSeletedDogId={setSeletedDogId} />
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
