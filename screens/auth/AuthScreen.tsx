import React, {useEffect, useState} from 'react';
import {Alert, Image, ImageBase, StyleSheet, View} from 'react-native';
import {deleteTokens, getData, storeData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../utils/constants';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {trimMilSec, TwoDays} from '../../utils/dataformat/timeformat';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import TextComp from '../components/TextComp';
import LocalLogin from './templates/LocalLogin';
import LocalJoin from './templates/LocalJoin';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthHome from './templates/AuthHome';
import {AuthStackList} from '../../routes';
import KakaoLogin from './templates/KakaoLogin';
import {
  MReissueAccessToken,
  MReissueAccessTokenVariables,
} from '../../__generated__/MReissueAccessToken';
import {QMe} from '../../__generated__/QMe';
import {mVUserAccessToken} from '../../apollo-setup';
import {colors} from '../../utils/colors';

interface IAuthScreenProps {
  setLoginState: Function;
}

const REISSUE_ACCESS_TOKEN = gql`
  mutation MReissueAccessToken($accessToken: String!, $refreshToken: String!) {
    reissueAccessToken(
      args: {accessToken: $accessToken, refreshToken: $refreshToken}
    ) {
      ok
      error
      accessToken
    }
  }
`;

export const ME = gql`
  query QMe {
    me {
      ok
      data {
        loginStrategy
        username
        dogname
        photo
        id
      }
    }
  }
`;

const LoginStack = createNativeStackNavigator<AuthStackList>();

function AuthScreen({setLoginState}: IAuthScreenProps) {
  const [accessToken, setAccessToken] = useState<string>();
  
  const [meQuery, {loading: meQueryLoading}] = useLazyQuery<QMe>(ME, {
    onError: () => Alert.alert('오류', '회원정보를 찾을수 없습니다.'),
  });

  useEffect(() => {
    if (accessToken) {
      mVUserAccessToken(accessToken);
      storeData({key: USER_ACCESS_TOKEN, value: accessToken}).then(async () => {
        meQuery().then(data => {
          const user = data.data?.me.data;
          console.log(user);
          if (user) {
            setLoginState(true);
          }
        });
      });
    }
  }, [accessToken]);

  return (
    <View style={styles.wrapper}>
      {meQueryLoading ? (
        <View>
          <TextComp text={'로그인 정보 확인중 ...'} />
        </View>
      ) : (
        <>
          <Image
            style={styles.image}
            source={require('../../assets/png/login.png')}
          />
          <KakaoLogin setAccessToken={setAccessToken} />
          {/* <LoginStack.Navigator>
            <LoginStack.Screen name={'AuthSelect'} component={AuthHome} />
            <LoginStack.Screen name={'Login'}>
              {() => <LocalLogin setAccessToken={setAccessToken} />}
            </LoginStack.Screen>
            <LoginStack.Screen name={'Join'} component={LocalJoin} />
          </LoginStack.Navigator> */}
        </>
      )}
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
});

export default AuthScreen;
