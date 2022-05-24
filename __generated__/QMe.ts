/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginStrategy } from "./globalTypes";

// ====================================================
// GraphQL query operation: QMe
// ====================================================

export interface QMe_me_data {
  __typename: "UserProfile";
  loginStrategy: LoginStrategy;
  username: string;
  photo: string | null;
  id: string;
}

export interface QMe_me {
  __typename: "CoreUserOutputDto";
  ok: boolean;
  data: QMe_me_data | null;
}

export interface QMe {
  me: QMe_me;
}
