import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {globalStore} from '../../globalStore';

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
        id
      }
    }
  }
`;

const LoginStack = createNativeStackNavigator<AuthStackList>();

function AuthScreen({setLoginState}: IAuthScreenProps) {
  const [accessToken, setAccessToken] = useState<string>();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);

  const [reissueAccessToken] = useMutation<
    MReissueAccessToken,
    MReissueAccessTokenVariables
  >(REISSUE_ACCESS_TOKEN);

  const [meQuery] = useLazyQuery<QMe>(ME);

  const getOrReissueToken = async () => {
    const storeAccessToken = await getData({key: USER_ACCESS_TOKEN});
    //저장소에 accessToken이 있을때
    if (storeAccessToken) {
      try {
        const decodedAccessToken = jwt_decode<JwtPayload>(storeAccessToken);
        //엑세스 토큰은 만료기한이 1주일임. 만료 2일전에 재발급함.
        if (
          decodedAccessToken.exp &&
          decodedAccessToken.exp < trimMilSec(Date.now() + TwoDays)
        ) {
          const refreshToken = await getData({key: USER_REFRESH_TOKEN});
          const decodedRefreshToken = jwt_decode<JwtPayload>(refreshToken);

          //리프레시 토큰만료이전을 확인 후 서버에 엑세스 토큰 요청
          if (
            decodedRefreshToken.exp &&
            decodedRefreshToken.exp > trimMilSec(Date.now())
          ) {
            //토큰 재발급
            const reIssueResult = await reissueAccessToken({
              variables: {
                accessToken: storeAccessToken,
                refreshToken,
              },
            });
            if (reIssueResult.data?.reissueAccessToken.ok) {
              const newAccessToken =
                reIssueResult.data?.reissueAccessToken.accessToken;
              if (newAccessToken) {
                await storeData({
                  key: USER_ACCESS_TOKEN,
                  value: newAccessToken,
                });
                //Apollo Client의 헤더에 추가하기 위해 저장.
                globalStore.setData({
                  key: USER_ACCESS_TOKEN,
                  value: accessToken,
                });
                //토큰이 정상적으로 발급되면 token저장 및 checkingToken 상태 해제
                setAccessToken(newAccessToken);
                setCheckingToken(false);
              } else {
                throw new Error();
              }
            }
          } else {
            throw new Error('리프레시 토큰이 만료됨');
          }
        } else {
          setAccessToken(storeAccessToken);
          setCheckingToken(false);
        }
      } catch (e) {
        console.log(e);
        deleteTokens();
        setCheckingToken(false);
      }
    } else {
      setCheckingToken(false);
    }
  };

  useEffect(() => {
    getOrReissueToken();
  }, [checkingToken]);

  useEffect(() => {
    if (accessToken) {
      globalStore.setData({key: USER_ACCESS_TOKEN, value: accessToken});
      meQuery().then(data => {
        const user = data.data?.me.data;
        if (user) {
          setLoginState(true);
        }
      });
    }
  }, [accessToken]);

  return (
    <>
      {checkingToken ? (
        <View>
          <TextComp text={'로그인 정보 확인중 ...'} />
        </View>
      ) : (
        <>
          <KakaoLogin setAccessToken={setAccessToken} />
          <LoginStack.Navigator>
            <LoginStack.Screen name={'AuthSelect'} component={AuthHome} />
            <LoginStack.Screen name={'Login'}>
              {() => <LocalLogin setAccessToken={setAccessToken} />}
            </LoginStack.Screen>
            <LoginStack.Screen name={'Join'} component={LocalJoin} />
          </LoginStack.Navigator>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;
