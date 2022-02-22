/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QGetWalks
// ====================================================

export interface QGetWalks_getWalks_data {
  __typename: "Walks";
  walkingTime: number;
  startTime: number;
  finishTime: number;
  id: string;
}

export interface QGetWalks_getWalks {
  __typename: "CoreWalksOutputDto";
  ok: boolean;
  data: QGetWalks_getWalks_data[] | null;
}

export interface QGetWalks {
  getWalks: QGetWalks_getWalks;
}
