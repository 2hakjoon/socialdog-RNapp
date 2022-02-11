/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: M_CREATE_WALK
// ====================================================

export interface M_CREATE_WALK_createWalk {
  __typename: "CreateWalkOutputDto";
  ok: boolean;
  error: string | null;
}

export interface M_CREATE_WALK {
  createWalk: M_CREATE_WALK_createWalk;
}

export interface M_CREATE_WALKVariables {
  walkingTime: number;
  startTime: number;
  finishTime: number;
  walkRecord: string;
}
