/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MCreateVerification
// ====================================================

export interface MCreateVerification_createVerification {
  __typename: "CoreOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MCreateVerification {
  createVerification: MCreateVerification_createVerification;
}

export interface MCreateVerificationVariables {
  email: string;
}
