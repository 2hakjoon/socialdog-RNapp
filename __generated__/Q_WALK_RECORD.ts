/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Q_WALK_RECORD
// ====================================================

export interface Q_WALK_RECORD_getWalk_data {
  __typename: "Walks";
  walkRecord: string;
}

export interface Q_WALK_RECORD_getWalk {
  __typename: "GetWalkOutputDto";
  ok: boolean;
  error: string | null;
  data: Q_WALK_RECORD_getWalk_data | null;
}

export interface Q_WALK_RECORD {
  getWalk: Q_WALK_RECORD_getWalk;
}

export interface Q_WALK_RECORDVariables {
  walkId: number;
}
