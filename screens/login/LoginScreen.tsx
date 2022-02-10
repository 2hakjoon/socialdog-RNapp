import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {getData, storeData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../utils/constants';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {Oneday, trimMilSec, TwoDays} from '../../utils/dataformat/timeformat';
import {gql, useMutation, useQuery} from '@apollo/client';
import {
  REISSUE_ACCESS_TOKEN_MUTATION,
  REISSUE_ACCESS_TOKEN_MUTATIONVariables,
} from '../../__generated__/REISSUE_ACCESS_TOKEN_MUTATION';
import TextComp from '../components/TextComp';
import LocalLogin from './templates/LocalLogin';

interface ILogInScreenProps {
  setUserData: Function;
}

const REISSUE_ACCESS_TOKEN = gql`
  mutation REISSUE_ACCESS_TOKEN_MUTATION(
    $accessToken: String!
    $refreshToken: String!
  ) {
    reissueAccessToken(
      args: {accessToken: $accessToken, refreshToken: $refreshToken}
    ) {
      ok
      error
      accessToken
    }
  }
`;

export function LogInScreen({setUserData}: ILogInScreenProps) {
  const [accessToken, setAccessToken] = useState<string>();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);
  const [reissueAccessToken, {loading: reissueLoding}] = useMutation<
    REISSUE_ACCESS_TOKEN_MUTATION,
    REISSUE_ACCESS_TOKEN_MUTATIONVariables
  >(REISSUE_ACCESS_TOKEN);

  const getOrReissueToken = async () => {
    const storeAccessToken = String(await getData({key: USER_ACCESS_TOKEN}));
    console.log(storeAccessToken);
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
            reissueAccessToken({
              variables: {
                accessToken: storeAccessToken,
                refreshToken,
              },
            }).then(async data => {
              const newAccessToken = data.data?.reissueAccessToken.accessToken;
              if (storeAccessToken) {
                await storeData({
                  key: USER_ACCESS_TOKEN,
                  value: newAccessToken,
                });
                setCheckingToken(false);
              }
            });
          }
        } else {
          setAccessToken(storeAccessToken);
          setCheckingToken(false);
        }
      } catch (e) {
        console.log(e);
        await storeData({key: USER_ACCESS_TOKEN, value: null});
        await storeData({key: USER_REFRESH_TOKEN, value: null});
        setCheckingToken(false);
      }
    } else {
      setCheckingToken(false);
    }
  };

  useEffect(() => {
    if (!reissueLoding) {
      if (!accessToken?.trim()) {
        getOrReissueToken();
      }
    }
  }, [reissueLoding]);

  console.log('최종', accessToken);

  return (
    <>
      {checkingToken ? (
        <View>
          <TextComp text={'로그인 정보 확인중 ...'} />
        </View>
      ) : (
        <>
          {!Boolean(accessToken?.length) && (
            <View style={styles.wrapper}>
              <LocalLogin />
            </View>
          )}
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
