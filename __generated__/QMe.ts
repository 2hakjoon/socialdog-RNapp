/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QMe
// ====================================================

export interface QMe_me_data {
  __typename: "UserProfileDto";
  dogname: string | null;
  id: number;
}

export interface QMe_me {
  __typename: "CoreUserOutputDto";
  ok: boolean;
  data: QMe_me_data | null;
}

export interface QMe {
  me: QMe_me;
}
