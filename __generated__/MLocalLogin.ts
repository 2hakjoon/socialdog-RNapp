/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MLocalLogin
// ====================================================

export interface MLocalLogin_localLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  acceptTerms: boolean | null;
}

export interface MLocalLogin {
  localLogin: MLocalLogin_localLogin;
}

export interface MLocalLoginVariables {
  args: LoginInputDto;
}
