/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import RecordingScreen from './screens/record/RecordingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import rootReducer from './module';
import {
  ProfileStackList,
  RootTabNavigator,
  SnsStackList,
  WalkStackList,
} from './routes';
import WalkRecordsScreen from './screens/walk-records/WalkRecordsScreen';
import {composeWithDevTools} from 'redux-devtools-extension';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import GeolocationComponent from './screens/components/GeolocationComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import WeatherScreen from './screens/weather/WeatherScreen';
import {ApolloProvider} from '@apollo/client';
import {deleteTokens, getData} from './utils/asyncStorage';
import AuthScreen from './screens/auth/AuthScreen';
import SocialScreen from './screens/social/SocialScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import EditProfileScreen from './screens/editProfile/EditProfileScreen';
import {client} from './apollo-setup';

const RootTab = createBottomTabNavigator<RootTabNavigator>();
const WalkStack = createNativeStackNavigator<WalkStackList>();
const SnsStack = createNativeStackNavigator<SnsStackList>();
const ProfileStack = createNativeStackNavigator<ProfileStackList>();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loginState, setLoginState] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const androidHasPermission = async () => {
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
  };

  const getAndroidLocationPermission = async () => {
    if (await androidHasPermission()) {
      setLocationPermission(true);
      return true;
    } else {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === 'granted') {
        setLocationPermission(true);
        Alert.alert(
          '백그라운드 위치정보.',
          '정상적인 위치정보 수집을 위해, 추가로 위치정보를 항상 허용으로 설정해주세요',
          [
            {
              text: '괜찮아요',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: '설정하기',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          '백그라운드 위치정보.',
          '위치정보 권한이 없으면, 관련 서비스를 이용하실 수 업습니다.',
          [
            {
              text: '확인',
            },
          ],
        );
      }
    }
  };

  const checkIosLocationPermission = async () => {
    const always = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    const whenUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log(always, whenUse);
    if (always === 'granted' || whenUse === 'granted') {
      setLocationPermission(true);
    } else {
      Alert.alert(
        '백그라운드 위치정보.',
        '정상적인 위치 수집을 위해, 위치정보를 항상 허용으로 설정해주세요',
        [
          {
            text: '알겠어요',
            onPress: () => {
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                .then(result => {
                  console.log(result);
                  if (result !== 'blocked') {
                    setLocationPermission(true);
                  }
                })
                .catch(error => console.log(error));
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      getAndroidLocationPermission();
    } else {
      checkIosLocationPermission();
    }
    deleteTokens();
  }, []);

  function Walk() {
    return (
      <WalkStack.Navigator>
        <WalkStack.Screen name={'Weather'} component={WeatherScreen} />
        <WalkStack.Screen name={'WalkRecords'} component={WalkRecordsScreen} />
        <WalkStack.Screen name={'Record'} component={RecordingScreen} />
      </WalkStack.Navigator>
    );
  }

  function Sns() {
    return (
      <SnsStack.Navigator>
        <SnsStack.Screen name={'Social'} component={SocialScreen} />
      </SnsStack.Navigator>
    );
  }

  function Profile() {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen name={'Profile'} component={ProfileScreen} />
        <ProfileStack.Screen
          name={'EditProfile'}
          component={EditProfileScreen}
        />
      </ProfileStack.Navigator>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SafeAreaView style={{height: '100%'}}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

          {locationPermission && <GeolocationComponent />}
          <NavigationContainer>
            {!loginState ? (
              <AuthScreen setLoginState={setLoginState} />
            ) : (
              <RootTab.Navigator>
                <RootTab.Screen
                  name={'WalkTab'}
                  component={Walk}
                  options={{
                    headerShown: false,
                    tabBarLabel: '산책',
                    tabBarIcon: ({color, size}) => (
                      <FAIcon name="dog" color={color} size={size} />
                    ),
                  }}
                />

                <RootTab.Screen
                  name={'SocialTab'}
                  component={Sns}
                  options={{
                    headerShown: false,
                    tabBarLabel: '친구들',
                    tabBarIcon: ({color, size}) => (
                      <MIcon name="nature-people" color={color} size={size} />
                    ),
                  }}
                />

                <RootTab.Screen
                  name={'ProfileTab'}
                  component={Profile}
                  options={{
                    headerShown: false,
                    tabBarLabel: '프로필',
                    tabBarIcon: ({color, size}) => (
                      <MIcon name="face" color={color} size={size} />
                    ),
                  }}
                />
              </RootTab.Navigator>
            )}
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
