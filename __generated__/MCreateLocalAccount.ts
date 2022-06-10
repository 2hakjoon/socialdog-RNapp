/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAccountInputDto } from "./globalTypes";

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
  args: CreateAccountInputDto;
}
