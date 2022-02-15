/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MCreateLocalAccount
// ====================================================

export interface MCreateLocalAccount_createLocalAccount {
  __typename: "CreateAccountOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MCreateLocalAccount {
  createLocalAccount: MCreateLocalAccount_createLocalAccount;
}

export interface MCreateLocalAccountVariables {
  email: string;
  password: string;
  code: string;
}
