import {gql} from '@apollo/client';

export const REISSUE_ACCESS_TOKEN = gql`
  mutation MReissueAccessToken($accessToken: String!, $refreshToken: String!) {
    reissueAccessToken(
      args: {accessToken: $accessToken, refreshToken: $refreshToken}
    ) {
      ok
      error
      accessToken
      isRefreshTokenExpired
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
