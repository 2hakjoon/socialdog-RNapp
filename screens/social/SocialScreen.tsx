import React, {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import WebView from 'react-native-webview';
import {mVUserAccessToken, mVUserRefreshToken} from '../../apollo-setup';
import {colors} from '../../utils/colors';
import EmotionSadCry from '../components/Icons/EmotionSadCry';
import TextComp from '../components/TextComp';

function SocialScreen() {
  const [onError, setOnError] = useState(false);
  // console.log('accessToken', mVUserAccessToken());
  // console.log('refreshToken', mVUserRefreshToken());

  const injectJsToWebView = `
    window.localStorage.setItem('USER_ACCESS_TOKEN', '${mVUserAccessToken()}');
    window.localStorage.setItem('USER_REFRESH_TOKEN', '${mVUserRefreshToken()}');
  `;

  return (
    <>
      {onError ? (
        <View style={styles.errorWrapper}>
          <View style={styles.errorInnerWrapper}>
            <EmotionSadCry size={70} color={colors.PDarkGray} />
            <TextComp
              text={'서버에 연결할 수 없습니다.'}
              size={20}
              color={colors.PDarkGray}
            />
            <TextComp
              text={'잠시 후 다시 시도해주세요.'}
              size={20}
              color={colors.PDarkGray}
            />
          </View>
        </View>
      ) : (
        <WebView
          source={{uri: Config.SOCIALDOG_FRONTEND}}
          style={{height: '100%', width: '100%'}}
          javaScriptEnabled={true}
          // userAgent={'SOCIALDOG_APP'}
          injectedJavaScriptBeforeContentLoaded={injectJsToWebView}
          renderLoading={() => (
            <ActivityIndicator
              size={'large'}
              color="black"
              style={{position: 'absolute', width: '100%', height: '100%'}}
            />
          )}
          startInLoadingState={true}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            setOnError(true);
            Alert.alert(
              '오류가 발생했습니다.',
              '서버에 접속할 수 없습니다. 잠시 후 다시 시도해주세요.',
            );
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorWrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorInnerWrapper: {
    height: '20%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SocialScreen;
