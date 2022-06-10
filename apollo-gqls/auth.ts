import {gql} from '@apollo/client';

export const JOIN = gql`
  mutation MCreateLocalAccount($args: CreateAccountInputDto!) {
    createLocalAccount(args: $args) {
      ok
      error
    }
  }
`;

export const CREATE_VERIFICATION = gql`
  mutation MCreateVerification($email: String!) {
    createVerification(args: {email: $email}) {
      ok
      error
    }
  }
`;

export const CHECK_VERIFICATION = gql`
  query MVerifyEmailAndCode($email: String!, $code: String!) {
    verifyEmailAndCode(args: {email: $email, code: $code}) {
      ok
      error
    }
  }
`;

export const LOCAL_LOGIN = gql`
  mutation MLocalLogin($args: LoginInputDto!) {
    localLogin(args: $args) {
      ok
      error
      accessToken
      refreshToken
      acceptTerms
    }
  }
`;
export const KAKAO_LOGIN = gql`
  mutation MKakaoLogin($args: KakaoLoginInputDto!) {
    kakaoLogin(args: $args) {
      ok
      error
      accessToken
      refreshToken
      acceptTerms
    }
  }
`;

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
        photo
        id
      }
    }
  }
`;

export const UPDATE_AUTH_LOCAL_ACCEPT_TERM = gql`
  mutation MUpdateAuthLocalAcceptTerm(
    $args: UpdateAuthLocalAcceptTermInputDto!
  ) {
    updateAuthLocalAcceptTerm(args: $args) {
      ok
      error
    }
  }
`;
