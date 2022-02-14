/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: M_CREATE_ACCOUNT
// ====================================================

export interface M_CREATE_ACCOUNT_createLocalAccount {
  __typename: "CreateAccountOutputDto";
  ok: boolean;
  error: string | null;
}

export interface M_CREATE_ACCOUNT {
  createLocalAccount: M_CREATE_ACCOUNT_createLocalAccount;
}

export interface M_CREATE_ACCOUNTVariables {
  email: string;
  password: string;
  code: string;
}
