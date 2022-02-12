/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: M_CREATE_ACCOUNT
// ====================================================

export interface M_CREATE_ACCOUNT_createAccount {
  __typename: "CreateAccountOutputDto";
  ok: boolean;
  error: string | null;
}

export interface M_CREATE_ACCOUNT {
  createAccount: M_CREATE_ACCOUNT_createAccount;
}

export interface M_CREATE_ACCOUNTVariables {
  email: string;
  password: string;
  username: string;
  code: string;
}
