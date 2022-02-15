/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MLocalLogin
// ====================================================

export interface MLocalLogin_localLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

export interface MLocalLogin {
  localLogin: MLocalLogin_localLogin;
}

export interface MLocalLoginVariables {
  email: string;
  password: string;
}
