import React from 'react';
import {Text} from 'react-native';
import WebView from 'react-native-webview';

function Social() {
  return (
    <>
      <Text>이곳은 소셜 페이지</Text>
      <WebView
        source={{uri: 'https://www.naver.com/'}}
        style={{height: '100%', width: '100%'}}
      />
    </>
  );
}

export default Social;
