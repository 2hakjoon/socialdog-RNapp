/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: REISSUE_ACCESS_TOKEN_MUTATION
// ====================================================

export interface REISSUE_ACCESS_TOKEN_MUTATION_reissueAccessToken {
  __typename: "ReissueAccessTokenOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

export interface REISSUE_ACCESS_TOKEN_MUTATION {
  reissueAccessToken: REISSUE_ACCESS_TOKEN_MUTATION_reissueAccessToken;
}

export interface REISSUE_ACCESS_TOKEN_MUTATIONVariables {
  accessToken: string;
  refreshToken: string;
}
