/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDogInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MCreateDog
// ====================================================

export interface MCreateDog_createDog {
  __typename: "CreateDogOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MCreateDog {
  createDog: MCreateDog_createDog;
}

export interface MCreateDogVariables {
  args: CreateDogInputDto;
}
