/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWalkInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MCreateWalk
// ====================================================

export interface MCreateWalk_createWalk {
  __typename: "CreateWalkOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MCreateWalk {
  createWalk: MCreateWalk_createWalk;
}

export interface MCreateWalkVariables {
  args: CreateWalkInputDto;
}
