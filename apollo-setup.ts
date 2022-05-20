import {
  ApolloClient,
  ApolloLink,
  concat,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {createUploadLink} from 'apollo-upload-client';
import {
  deleteTokens,
  getAuthTokens,
  getData,
  storeData,
} from './utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from './utils/constants';
import Config from 'react-native-config';
import {
  MReissueAccessToken,
  MReissueAccessTokenVariables,
} from './__generated__/MReissueAccessToken';
import {REISSUE_ACCESS_TOKEN} from './apollo-gqls/auth';
import {Alert} from 'react-native';

export const mVUserAccessToken = makeVar('');
export const mVUserRefreshToken = makeVar('');
export const mVLoginState = makeVar(false);

let ApolloLinkAccessToken = '';
let ApolloLinkRefreshToken = '';

const httpLink = new HttpLink({
  uri: 'http://121.154.94.120/graphql',
  // uri: 'https://socialdog-backend.herokuapp.com/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const promises = fromPromise(getAuthTokens());
  return promises.flatMap(({accessToken, refreshToken}) => {
    ApolloLinkAccessToken = accessToken;
    ApolloLinkRefreshToken = refreshToken;
    operation.setContext(({headers = {}}) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${accessToken}`,
      },
    }));
    return forward(operation);
  });
});

const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (
      client &&
      graphQLErrors?.filter(error => error.message === 'Unauthorized').length
    ) {
      // 토큰이 두개중 하나라도 없으면 함수 탈출
      if (!(ApolloLinkAccessToken && ApolloLinkRefreshToken)) {
        return;
      }

      //fromPromise함수에 토큰 재발급 mutation 넣어서 return받음.
      const promises = fromPromise(
        client
          .mutate<MReissueAccessToken, MReissueAccessTokenVariables>({
            mutation: REISSUE_ACCESS_TOKEN,
            variables: {
              accessToken: ApolloLinkAccessToken,
              refreshToken: ApolloLinkRefreshToken,
            },
          })
          .then(async data => {
            // 응답이 정상적으로 왔다면 이어서 진행.
            // accessToken이 담겨왔다면, asyncStorage에 저장.
            if (data.data?.reissueAccessToken.accessToken) {
              storeData({
                key: USER_ACCESS_TOKEN,
                value: data.data.reissueAccessToken.accessToken,
              });
            }
            // refreshToken이 만료되었거나, 리프레시 토큰이 불일치 하다면,
            // 캐시를 전부 지우고, 로그인 해제
            if (data.data?.reissueAccessToken.error) {
              Alert.alert(
                '다시 로그인 해주시요.',
                '보안을 위해서 다시 로그인해주세요.',
              );
              deleteTokens();
              client.stop();
              client.resetStore();
            }
          }),
      );

      //mutation에 flatMap으로 promise된 요청이 있었다면 헤더를 바꿔서 이전요청 다시 요청
      return promises.flatMap(() => {
        // 이전의 요청에서 header불러오기
        const oldHeaders = operation.getContext().headers;
        operation.setContext({
          headers: {
            ...oldHeaders,
            // localStorage에 저장했던 accessToken다시 호출
            authorization: `Bearer ${ApolloLinkAccessToken}`,
          },
        });
        return forward(operation);
      });
    }

    //이 이외에 다른 에러가 있다면 console.log
    console.log(
      `[GraphQL error]: Message: ${graphQLErrors?.[0].message}, Location: ${graphQLErrors?.[0].locations}, Path: ${graphQLErrors?.[0].path}`,
    );
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, httpLink]),
});
