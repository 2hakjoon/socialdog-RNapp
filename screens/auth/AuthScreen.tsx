import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, StyleSheet, View} from 'react-native';
import {getData, storeData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN} from '../../utils/constants';
import {useLazyQuery} from '@apollo/client';
import TextComp from '../components/TextComp';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackList} from '../../routes';
import KakaoLogin from './templates/KakaoLogin';
import {QMe} from '../../__generated__/QMe';
import {mVLoginState, mVUserAccessToken} from '../../apollo-setup';
import {colors} from '../../utils/colors';
import {ME} from '../../apollo-gqls/auth';

interface IAuthScreenProps {
  setLoginState: Function;
}

const LoginStack = createNativeStackNavigator<AuthStackList>();

function AuthScreen() {
  const [accessToken, setAccessToken] = useState<string>();

  const [meQuery, {loading: meQueryLoading}] = useLazyQuery<QMe>(ME, {
    onError: e => {
      console.log(e);
      Alert.alert('로그인 실패', '회원정보를 찾을수 없습니다.');
    },
  });

  useEffect(() => {
    if (accessToken) {
      mVUserAccessToken(accessToken);
      storeData({key: USER_ACCESS_TOKEN, value: accessToken}).then(async () => {
        meQuery().then(data => {
          const user = data.data?.me.data;
          // console.log(user);
          if (user) {
            mVLoginState(true);
          }
        });
      });
    } else {
      getData({key: USER_ACCESS_TOKEN}).then(token => {
        setAccessToken(token);
      });
    }
  }, [accessToken]);

  return (
    <View style={styles.wrapper}>
      <>
        <Image
          style={styles.image}
          source={require('../../assets/png/login.png')}
        />
        {meQueryLoading ? (
          <View style={styles.loading}>
            <TextComp
              text={'로그인 정보 확인 중'}
              size={18}
              weight={'600'}
              color={'white'}
            />
            <ActivityIndicator
              size={'small'}
              color="white"
              style={{paddingLeft: 6}}
            />
          </View>
        ) : (
          <KakaoLogin setAccessToken={setAccessToken} />
        )}
        {/* <LoginStack.Navigator>
            <LoginStack.Screen name={'AuthSelect'} component={AuthHome} />
            <LoginStack.Screen name={'Login'}>
              {() => <LocalLogin setAccessToken={setAccessToken} />}
            </LoginStack.Screen>
            <LoginStack.Screen name={'Join'} component={LocalJoin} />
          </LoginStack.Navigator> */}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.PBlue,
  },
  image: {
    width: '90%',
    height: '10%',
    flex: 6,
  },
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default AuthScreen;
