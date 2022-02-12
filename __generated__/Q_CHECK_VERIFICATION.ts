/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Q_CHECK_VERIFICATION
// ====================================================

export interface Q_CHECK_VERIFICATION_verifyEmailAndCode {
  __typename: "CoreOutputDto";
  ok: boolean;
  error: string | null;
}

export interface Q_CHECK_VERIFICATION {
  verifyEmailAndCode: Q_CHECK_VERIFICATION_verifyEmailAndCode;
}

export interface Q_CHECK_VERIFICATIONVariables {
  email: string;
  code: string;
}
