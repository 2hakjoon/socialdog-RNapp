import {gql, useMutation} from '@apollo/client';
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import React, {useState} from 'react';
import {Button} from 'react-native';
import {storeData} from '../../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../../utils/constants';
import {
  kakaoLogin,
  kakaoLoginVariables,
} from '../../../__generated__/kakaoLogin';

interface IKakaoLoginProps {
  setAccessToken: Function;
}

const KAKAO_LOGIN = gql`
  mutation kakaoLogin(
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

function KakaoLogin({setAccessToken}: IKakaoLoginProps) {
  const [kakaoLogin] = useMutation<kakaoLogin, kakaoLoginVariables>(
    KAKAO_LOGIN,
  );

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
        setAccessToken(accessToken);
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

  return <Button title="카카오" onPress={signInWithKakao} />;
}

export default KakaoLogin;
