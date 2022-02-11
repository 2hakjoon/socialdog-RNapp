/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Q_WALK_RECORDS
// ====================================================

export interface Q_WALK_RECORDS_getWalks_data {
  __typename: "Walks";
  walkingTime: number;
  startTime: number;
  finishTime: number;
  id: number;
}

export interface Q_WALK_RECORDS_getWalks {
  __typename: "CoreWalksOutputDto";
  ok: boolean;
  data: Q_WALK_RECORDS_getWalks_data[] | null;
}

export interface Q_WALK_RECORDS {
  getWalks: Q_WALK_RECORDS_getWalks;
}
