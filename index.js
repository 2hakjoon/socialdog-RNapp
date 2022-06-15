/**
 * @format
 */

import {AppRegistry} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';

const codePushConfig = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  deploymentKey: Config.CODE_PUSH_KEY,
  updateDialog: false,
  InstallMode: CodePush.InstallMode.IMMEDIATE,
};

AppRegistry.registerComponent(appName, () => CodePush(codePushConfig)(App));
