/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FileType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MCreatePreSignedUrl
// ====================================================

export interface MCreatePreSignedUrl_createPreSignedUrl {
  __typename: "CreatePreSignedUrlOutputDto";
  ok: boolean;
  url: string;
}

export interface MCreatePreSignedUrl {
  createPreSignedUrl: MCreatePreSignedUrl_createPreSignedUrl;
}

export interface MCreatePreSignedUrlVariables {
  filename?: string | null;
  fileType?: FileType | null;
}
