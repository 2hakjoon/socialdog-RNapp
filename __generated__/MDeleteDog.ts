/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteDogInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MDeleteDog
// ====================================================

export interface MDeleteDog_deleteDog {
  __typename: "DeleteDogOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MDeleteDog {
  deleteDog: MDeleteDog_deleteDog;
}

export interface MDeleteDogVariables {
  args: DeleteDogInputDto;
}
