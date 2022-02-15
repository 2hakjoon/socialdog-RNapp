/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MVerifyEmailAndCode
// ====================================================

export interface MVerifyEmailAndCode_verifyEmailAndCode {
  __typename: "CoreOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MVerifyEmailAndCode {
  verifyEmailAndCode: MVerifyEmailAndCode_verifyEmailAndCode;
}

export interface MVerifyEmailAndCodeVariables {
  email: string;
  code: string;
}
