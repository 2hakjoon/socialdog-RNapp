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

export interface CreateDogInputDto {
  name: string;
  photo: string;
  birthDay?: string | null;
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

//==============================================================
// END Enums and Input Objects
//==============================================================
