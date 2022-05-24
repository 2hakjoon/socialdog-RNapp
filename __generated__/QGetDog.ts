/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetDogInputDto } from "./globalTypes";

// ====================================================
// GraphQL query operation: QGetDog
// ====================================================

export interface QGetDog_getDog_data {
  __typename: "Dogs";
  id: string;
  name: string;
  photo: string;
  birthDay: string | null;
}

export interface QGetDog_getDog {
  __typename: "GetDogOutputDto";
  ok: boolean;
  error: string | null;
  data: QGetDog_getDog_data | null;
}

export interface QGetDog {
  getDog: QGetDog_getDog;
}

export interface QGetDogVariables {
  args: GetDogInputDto;
}
