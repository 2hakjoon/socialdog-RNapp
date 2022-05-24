/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QGetDogs
// ====================================================

export interface QGetDogs_getMyDogs_data {
  __typename: "Dogs";
  id: string;
  name: string;
  photo: string;
  birthDay: string | null;
}

export interface QGetDogs_getMyDogs {
  __typename: "GetMyDogsOutputDto";
  ok: boolean;
  data: QGetDogs_getMyDogs_data[] | null;
  error: string | null;
}

export interface QGetDogs {
  getMyDogs: QGetDogs_getMyDogs;
}
