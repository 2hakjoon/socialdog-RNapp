import React from 'react';
import WebView from 'react-native-webview';

function SocialScreen() {
  return (
    <>
      <WebView
        source={{uri: 'http://localhost:3000/'}}
        style={{height: '100%', width: '100%'}}
      />
    </>
  );
}

export default SocialScreen;
