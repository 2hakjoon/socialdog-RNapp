/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QGetWalk
// ====================================================

export interface QGetWalk_getWalk_data {
  __typename: "Walks";
  walkRecord: string;
}

export interface QGetWalk_getWalk {
  __typename: "GetWalkOutputDto";
  ok: boolean;
  error: string | null;
  data: QGetWalk_getWalk_data | null;
}

export interface QGetWalk {
  getWalk: QGetWalk_getWalk;
}

export interface QGetWalkVariables {
  walkId: number;
}
