import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {deleteTokens, getData, storeData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../utils/constants';
import jwt_decode, {JwtPayload} from 'jwt-decode';
import {trimMilSec, TwoDays} from '../../utils/dataformat/timeformat';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import {
  REISSUE_ACCESS_TOKEN_MUTATION,
  REISSUE_ACCESS_TOKEN_MUTATIONVariables,
} from '../../__generated__/REISSUE_ACCESS_TOKEN_MUTATION';
import TextComp from '../components/TextComp';
import LocalLogin from './templates/LocalLogin';
import {authHeader} from '../../utils/dataformat/graphqlHeader';
import {useDispatch} from 'react-redux';
import {authorize} from '../../module/auth';
import {GET_PROFILE_QUERY} from '../../__generated__/GET_PROFILE_QUERY';
import LocalJoin from './templates/LocalJoin';

interface ILogInScreenProps {
  setLoginState: Function;
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

const ME = gql`
  query GET_PROFILE_QUERY {
    me {
      ok
      data {
        username
        dogname
        email
        id
      }
    }
  }
`;

export function LogInScreen({setLoginState}: ILogInScreenProps) {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState<string>();
  const [checkingToken, setCheckingToken] = useState<boolean>(true);

  const [reissueAccessToken] = useMutation<
    REISSUE_ACCESS_TOKEN_MUTATION,
    REISSUE_ACCESS_TOKEN_MUTATIONVariables
  >(REISSUE_ACCESS_TOKEN);

  const [meQuery] = useLazyQuery<GET_PROFILE_QUERY>(
    ME,
    authHeader(accessToken),
  );

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
            reissueAccessToken({
              variables: {
                accessToken: storeAccessToken,
                refreshToken,
              },
            }).then(async data => {
              console.log('여기는 then', data);
              const newAccessToken = data.data?.reissueAccessToken.accessToken;
              await storeData({
                key: USER_ACCESS_TOKEN,
                value: newAccessToken,
              });
              //토큰이 정상적으로 발급되면 token저장 및 checkingToken 상태 해제
              if (newAccessToken) {
                setAccessToken(newAccessToken);
                setCheckingToken(false);
              } else {
                throw new Error();
              }
            });
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
      meQuery().then(data => {
        const user = data.data?.me.data;
        if (user) {
          setLoginState(true);
          dispatch(authorize({...user, accessToken}));
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
          {/* {!Boolean(accessToken?.length) && ( */}
          {false && (
            <View style={styles.wrapper}>
              <LocalLogin setAccessToken={setAccessToken} />
            </View>
          )}
          {
            <View>
              <LocalJoin />
            </View>
          }
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
