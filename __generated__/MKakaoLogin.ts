/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MKakaoLogin
// ====================================================

export interface MKakaoLogin_kakaoLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface MKakaoLogin {
  kakaoLogin: MKakaoLogin_kakaoLogin;
}

export interface MKakaoLoginVariables {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  scopes: string;
}
