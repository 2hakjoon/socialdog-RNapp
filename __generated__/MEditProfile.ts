/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MEditProfile
// ====================================================

export interface MEditProfile_editProfile {
  __typename: "EditProfileOutputDto";
  ok: boolean;
  error: string | null;
}

export interface MEditProfile {
  editProfile: MEditProfile_editProfile;
}

export interface MEditProfileVariables {
  username?: string | null;
  password?: string | null;
  photo?: string | null;
}
