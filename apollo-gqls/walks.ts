import {gql} from '@apollo/client';

export const GET_WALK_RECORDS = gql`
  query QGetWalks {
    getWalks {
      ok
      data {
        walkingTime
        startTime
        finishTime
        id
      }
    }
  }
`;

export const GET_WALK_RECORD = gql`
  query QGetWalk($walkId: String!) {
    getWalk(args: {walkId: $walkId}) {
      ok
      error
      data {
        walkRecord
      }
    }
  }
`;
