/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * upload file type.
 */
export enum FileType {
  IMAGE = "IMAGE",
}

export enum LoginStrategy {
  KAKAO = "KAKAO",
  LOCAL = "LOCAL",
}

export interface CreateAccountInputDto {
  email: string;
  password: string;
  code: string;
  acceptTerms: boolean;
}

export interface CreateDogInputDto {
  name: string;
  photo: string;
  birthDay?: string | null;
}

export interface CreateWalkInputDto {
  walkingTime: number;
  startTime: number;
  finishTime: number;
  walkRecord: string;
  dogId?: string | null;
}

export interface DeleteDogInputDto {
  id: string;
}

export interface DeleteWalkInputDto {
  walkId: string;
}

export interface EditDogInputDto {
  name?: string | null;
  photo?: string | null;
  birthDay?: string | null;
  id: string;
}

export interface FileInputDto {
  filename: string;
  fileType: FileType;
}

export interface GetDogInputDto {
  id: string;
}

export interface KakaoLoginInputDto {
  accessToken: string;
  accessTokenExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: string | null;
  scopes?: string | null;
  acceptTerms: boolean;
}

export interface LoginInputDto {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface UpdateAuthLocalAcceptTermInputDto {
  acceptTerms: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
