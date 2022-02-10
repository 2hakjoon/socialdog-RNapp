/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROFILE_QUERY
// ====================================================

export interface GET_PROFILE_QUERY_me_data {
  __typename: "UserDto";
  username: string;
  dogname: string | null;
  email: string;
  id: number;
}

export interface GET_PROFILE_QUERY_me {
  __typename: "CoreUserOutputDto";
  ok: boolean;
  data: GET_PROFILE_QUERY_me_data | null;
}

export interface GET_PROFILE_QUERY {
  me: GET_PROFILE_QUERY_me;
}
