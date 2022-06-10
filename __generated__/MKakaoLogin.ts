/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { KakaoLoginInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MKakaoLogin
// ====================================================

export interface MKakaoLogin_kakaoLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  acceptTerms: boolean | null;
}

export interface MKakaoLogin {
  kakaoLogin: MKakaoLogin_kakaoLogin;
}

export interface MKakaoLoginVariables {
  args: KakaoLoginInputDto;
}
