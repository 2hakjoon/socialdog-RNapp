import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import Config from 'react-native-config';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import {mVUserAccessToken, mVUserRefreshToken} from '../../apollo-setup';
import {RootState} from '../../module';
import {colors} from '../../utils/colors';
import EmotionSadCry from '../components/Icons/EmotionSadCry';
import TextComp from '../components/TextComp';

function SocialScreen() {
  const [onError, setOnError] = useState(false);
  const geolocation = useSelector(
    (state: RootState) => state.geolocation.geolocation,
  );
  // console.log('accessToken', mVUserAccessToken());
  // console.log('refreshToken', mVUserRefreshToken());
  const injectJsToWebView = `
  window.localStorage.setItem('USER_ACCESS_TOKEN', '${mVUserAccessToken()}');
  window.localStorage.setItem('USER_REFRESH_TOKEN', '${mVUserRefreshToken()}');
  window.localStorage.setItem('GEOLOCATION', '${JSON.stringify(geolocation)}');
  (function() {
    function wrap(fn) {
      return function wrapper() {
        var res = fn.apply(this, arguments);
        window.ReactNativeWebView.postMessage('navigationStateChange');
        return res;
      }
    }

    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', function() {
      window.ReactNativeWebView.postMessage('navigationStateChange');
    });
  })();

  true;
  `;

  const webview = useRef<WebView<{}>>(null);
  const [isCanGoBack, setIsCanGoBack] = useState(false);
  const onPressHardwareBackButton = () => {
    if (webview.current && isCanGoBack) {
      webview.current.goBack();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      onPressHardwareBackButton,
    );
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        onPressHardwareBackButton,
      );
    };
  }, [isCanGoBack]);

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
          ref={webview}
          onMessage={({nativeEvent: state}) => {
            if (state.data === 'navigationStateChange') {
              // Navigation state updated, can check state.canGoBack, etc.
              setIsCanGoBack(state.canGoBack);
            }
          }}
          source={{uri: Config.SOCIALDOG_FRONTEND}}
          style={{height: '100%', width: '100%'}}
          javaScriptEnabled={true}
          userAgent={'SOCIALDOG_APP'}
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
