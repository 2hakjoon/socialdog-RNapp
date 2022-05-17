/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteWalkInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MDeleteWalk
// ====================================================

export interface MDeleteWalk_deleteWalk {
  __typename: "CoreOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MDeleteWalk {
  deleteWalk: MDeleteWalk_deleteWalk;
}

export interface MDeleteWalkVariables {
  args: DeleteWalkInputDto;
}
