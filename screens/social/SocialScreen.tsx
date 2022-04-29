import React from 'react';
import WebView from 'react-native-webview';

function SocialScreen() {
  // const myInjectedJs = `
  //   ((){ let tk = window.localStorage.getItem('tokenKey');
  //     if(!tk || (tk && tk != '${token}')){
  //       window.localStorage.setItem('tokenKey', '${token}');
  //       window.location.reload();
  //     }
  //   })();`;
  return (
    <>
      <WebView
        source={{uri: 'https://oursocialdog.com/'}}
        style={{height: '100%', width: '100%'}}
      />
    </>
  );
}

export default SocialScreen;
