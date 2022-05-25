import {gql} from '@apollo/client';

export const CREATE_PRESIGNED_URL = gql`
  mutation MCreatePreSignedUrls($files: [FileInputDto!]!) {
    createPreSignedUrls(args: {files: $files}) {
      ok
      urls
    }
  }
`;
