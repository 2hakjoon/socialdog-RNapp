/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MReissueAccessToken
// ====================================================

export interface MReissueAccessToken_reissueAccessToken {
  __typename: "ReissueAccessTokenOutputDto";
  ok: boolean;
  error: string | null;
  accessToken: string | null;
}

export interface MReissueAccessToken {
  reissueAccessToken: MReissueAccessToken_reissueAccessToken;
}

export interface MReissueAccessTokenVariables {
  accessToken: string;
  refreshToken: string;
}
