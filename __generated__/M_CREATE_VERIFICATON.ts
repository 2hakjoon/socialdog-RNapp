/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: M_CREATE_VERIFICATON
// ====================================================

export interface M_CREATE_VERIFICATON_createVerification {
  __typename: "CoreOutputDto";
  ok: boolean;
  error: string | null;
}

export interface M_CREATE_VERIFICATON {
  createVerification: M_CREATE_VERIFICATON_createVerification;
}

export interface M_CREATE_VERIFICATONVariables {
  email: string;
}
