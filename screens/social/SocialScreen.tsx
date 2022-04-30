import React from 'react';
import WebView from 'react-native-webview';
import {mVUserAccessToken, mVUserRefreshToken} from '../../apollo-setup';

function SocialScreen() {
  console.log('accessToken', mVUserAccessToken());
  console.log('refreshToken', mVUserRefreshToken());

  const injectJsToWebView = `
    window.localStorage.setItem('USER_ACCESS_TOKEN', '${mVUserAccessToken()}');
    window.localStorage.setItem('USER_REFRESH_TOKEN', '${mVUserRefreshToken()}');
  `;

  return (
    <>
      <WebView
        source={{uri: 'http://121.154.94.120:4000'}}
        //source={{uri: 'https://oursocialdog.com'}}
        style={{height: '100%', width: '100%'}}
        javaScriptEnabled={true}
        // userAgent={'SOCIALDOG_APP'}
        injectedJavaScriptBeforeContentLoaded={injectJsToWebView}
      />
    </>
  );
}

export default SocialScreen;
