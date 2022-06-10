/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAuthLocalAcceptTermInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MUpdateAuthLocalAcceptTerm
// ====================================================

export interface MUpdateAuthLocalAcceptTerm_updateAuthLocalAcceptTerm {
  __typename: "UpdateAuthLocalAcceptTermOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MUpdateAuthLocalAcceptTerm {
  updateAuthLocalAcceptTerm: MUpdateAuthLocalAcceptTerm_updateAuthLocalAcceptTerm;
}

export interface MUpdateAuthLocalAcceptTermVariables {
  args: UpdateAuthLocalAcceptTermInputDto;
}
