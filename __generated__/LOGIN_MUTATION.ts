/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LOGIN_MUTATION
// ====================================================

export interface LOGIN_MUTATION_localLogin {
  __typename: "LoginOutputDto";
  ok: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

export interface LOGIN_MUTATION {
  localLogin: LOGIN_MUTATION_localLogin;
}

export interface LOGIN_MUTATIONVariables {
  email: string;
  password: string;
}
