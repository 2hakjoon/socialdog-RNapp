import {gql, useLazyQuery, useMutation} from '@apollo/client';
import {
  KakaoOAuthToken,
  getProfile as getKakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ME} from '../../../apollo-gqls/auth';
import {mVLoginState, mVUserAccessToken} from '../../../apollo-setup';
import {storeData} from '../../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../../utils/constants';
import {
  MKakaoLogin,
  MKakaoLoginVariables,
} from '../../../__generated__/MKakaoLogin';
import {QMe} from '../../../__generated__/QMe';
import IconBubble from '../../components/Icons/IconBubble';
import TextComp from '../../components/TextComp';

const KAKAO_LOGIN = gql`
  mutation MKakaoLogin(
    $accessToken: String!
    $accessTokenExpiresAt: String!
    $refreshToken: String!
    $refreshTokenExpiresAt: String!
    $scopes: String!
  ) {
    kakaoLogin(
      args: {
        accessToken: $accessToken
        accessTokenExpiresAt: $accessTokenExpiresAt
        refreshToken: $refreshToken
        refreshTokenExpiresAt: $refreshTokenExpiresAt
        scopes: $scopes
      }
    ) {
      ok
      error
      accessToken
      refreshToken
    }
  }
`;

function KakaoLogin() {
  const [kakaoLogin, {loading: kakaoLoginLoading}] = useMutation<
    MKakaoLogin,
    MKakaoLoginVariables
  >(KAKAO_LOGIN);
  const [meQuery, {loading: meQueryLoading}] = useLazyQuery<QMe>(ME);

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      const tokenToDto = {
        ...token,
        accessTokenExpiresAt: String(token.accessTokenExpiresAt),
        refreshTokenExpiresAt: String(token.refreshTokenExpiresAt),
        scopes: JSON.stringify(token.scopes),
      };

      const {data} = await kakaoLogin({variables: tokenToDto});

      const accessToken = data?.kakaoLogin.accessToken;
      const refreshToken = data?.kakaoLogin.refreshToken;

      if (accessToken && refreshToken) {
        await storeData({
          key: USER_ACCESS_TOKEN,
          value: accessToken,
        });
        await storeData({
          key: USER_REFRESH_TOKEN,
          value: refreshToken,
        });

        mVUserAccessToken(accessToken);
        meQuery().then(data => {
          const user = data.data?.me.data;
          // console.log(user);
          if (user) {
            mVLoginState(true);
          } else if (!data.data?.me.ok) {
            Alert.alert('로그인 실패', '회원정보를 찾을수 없습니다.');
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  // const signOutWithKakao = async (): Promise<void> => {
  //   const message = await logout();

  //   setResult(message);
  // };

  // const getKakaoProfile = async (): Promise<void> => {
  //   const profile: KakaoProfile = await getProfile();

  //   setResult(JSON.stringify(profile));
  // };

  // const unlinkKakao = async (): Promise<void> => {
  //   const message = await unlink();

  //   setResult(message);
  // };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={signInWithKakao} style={styles.buttonWrapper}>
        {kakaoLoginLoading ? (
          <View style={styles.loading}>
            <TextComp
              text={'로그인 중'}
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
          <TouchableOpacity style={styles.button}>
            <IconBubble color="black" size={24} />
            <View style={styles.textWrapper}>
              <TextComp
                text={'카카오 로그인'}
                color={'#000000'}
                size={18}
                weight={'500'}
              />
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: '80%',
    backgroundColor: '#FEE500',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  textWrapper: {
    width: '90%',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    display: 'flex',
    height: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default KakaoLogin;
