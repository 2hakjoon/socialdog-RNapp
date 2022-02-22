/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FileInputDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MCreatePreSignedUrls
// ====================================================

export interface MCreatePreSignedUrls_createPreSignedUrls {
  __typename: "CreatePreSignedUrlsOutputDto";
  ok: boolean;
  urls: string[];
}

export interface MCreatePreSignedUrls {
  createPreSignedUrls: MCreatePreSignedUrls_createPreSignedUrls;
}

export interface MCreatePreSignedUrlsVariables {
  files: FileInputDto[];
}
