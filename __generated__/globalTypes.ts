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

export interface DeleteWalkInputDto {
  walkId: string;
}

export interface FileInputDto {
  filename: string;
  fileType: FileType;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
