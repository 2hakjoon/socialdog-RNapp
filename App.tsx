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
import {StatusBar, StyleSheet} from 'react-native';
import RecordingScreen from './screens/record/RecordingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import rootReducer from './module';
import {RootTabNavigator, SnsStackList, WalkStackList} from './routes';
import {composeWithDevTools} from 'redux-devtools-extension';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import GeolocationComponent from './screens/components/GeolocationComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import WeatherScreen from './screens/weather/WeatherScreen';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import AuthScreen from './screens/auth/AuthScreen';
import SocialScreen from './screens/social/SocialScreen';
import {client, mVLoginState} from './apollo-setup';
import WalkRecordsScreen from './screens/walk-records/WalkRecordsScreen';
import {colors} from './utils/colors';
import {GpsFilter} from './utils/filter/gpsFilter';

const RootTab = createBottomTabNavigator<RootTabNavigator>();
const WalkStack = createNativeStackNavigator<WalkStackList>();
const SnsStack = createNativeStackNavigator<SnsStackList>();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));

export const gpsFilter = new GpsFilter({round: 10, prevWeight: 0.8});

const App = () => {
  const loginState = useReactiveVar(mVLoginState);
  function Walk() {
    return (
      <WalkStack.Navigator>
        <WalkStack.Screen
          options={{title: '오늘의 날씨'}}
          name={'Weather'}
          component={WeatherScreen}
        />
        <WalkStack.Screen
          name={'WalkRecords'}
          options={{title: '산책 기록'}}
          component={WalkRecordsScreen}
        />
        <WalkStack.Screen
          name={'Record'}
          options={{title: '산책 하기'}}
          component={RecordingScreen}
        />
      </WalkStack.Navigator>
    );
  }

  function Sns() {
    return (
      <SnsStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <SnsStack.Screen name={'Social'} component={SocialScreen} />
      </SnsStack.Navigator>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SafeAreaView style={{height: '100%'}}>
          <StatusBar
            backgroundColor={!loginState ? colors.PBlue : 'white'}
            barStyle={!loginState ? 'light-content' : 'dark-content'}
          />

          <GeolocationComponent />

          <NavigationContainer>
            {!loginState ? (
              <AuthScreen />
            ) : (
              <RootTab.Navigator>
                <RootTab.Screen
                  name={'WalkTab'}
                  component={Walk}
                  options={{
                    headerShown: false,
                    tabBarLabel: '산책',
                    tabBarStyle: styles.tabBar,
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
                    tabBarStyle: styles.tabBar,
                    tabBarIcon: ({color, size}) => (
                      <MIcon name="nature-people" color={color} size={size} />
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

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 10,
  },
});

export default App;
