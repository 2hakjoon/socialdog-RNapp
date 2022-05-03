import {
  ApolloClient,
  ApolloLink,
  concat,
  fromPromise,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import {getData} from './utils/asyncStorage';
import {USER_ACCESS_TOKEN} from './utils/constants';
import Config from 'react-native-config';

export const mVUserAccessToken = makeVar('');
export const mVUserRefreshToken = makeVar('');

console.log(Config.BACKEND_API_URL);

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const promises = fromPromise(getData({key: USER_ACCESS_TOKEN}));
  return promises.flatMap(data => {
    operation.setContext(({headers = {}}) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${data}`,
      },
    }));
    return forward(operation);
  });
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, createUploadLink({uri: Config.BACKEND_API_URL})),
});
