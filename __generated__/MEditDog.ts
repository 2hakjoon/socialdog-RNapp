/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditDogInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MEditDog
// ====================================================

export interface MEditDog_editDog {
  __typename: "EditDogOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MEditDog {
  editDog: MEditDog_editDog;
}

export interface MEditDogVariables {
  args: EditDogInputDto;
}
