/**
 * @format
 */

import {AppRegistry} from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import App from './App';
import {name as appName} from './app.json';

const codePushConfig = {
  checkFrequency: 'ON_APP_RESUME',
  deploymentKey: Config.CODE_PUSH_KEY,
  InstallMode: 'ON_NEXT_RESTART',
};

AppRegistry.registerComponent(appName, () => CodePush(codePushConfig)(App));
