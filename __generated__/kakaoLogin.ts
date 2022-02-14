/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: kakaoLogin
// ====================================================

export interface kakaoLogin_kakaoLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface kakaoLogin {
  kakaoLogin: kakaoLogin_kakaoLogin;
}

export interface kakaoLoginVariables {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  scopes: string;
}
