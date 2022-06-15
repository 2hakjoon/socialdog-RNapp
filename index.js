/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';

const codePushConfig = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  deploymentKey:
    Platform.OS === 'android'
      ? Config.CODE_PUSH_KEY_ANDROID
      : Config.CODE_PUSH_KEY_IOS,
  updateDialog: false,
  InstallMode: CodePush.InstallMode.IMMEDIATE,
};

AppRegistry.registerComponent(appName, () => CodePush(codePushConfig)(App));
