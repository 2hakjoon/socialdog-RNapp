import {gql} from '@apollo/client';

export const GET_DOGS = gql`
  query QGetDogs {
    getMyDogs {
      ok
      data {
        id
        name
        photo
        birthDay
      }
      error
    }
  }
`;

export const QGET_DOG = gql`
  query QGetDog($args: GetDogInputDto!) {
    getDog(args: $args) {
      ok
      error
      data {
        id
        name
        photo
        birthDay
      }
    }
  }
`;

export const EDIT_DOG = gql`
  mutation MEditDog($args: EditDogInputDto!) {
    editDog(args: $args) {
      ok
      error
    }
  }
`;

export const DELETE_DOG = gql`
  mutation MDeleteDog($args: DeleteDogInputDto!) {
    deleteDog(args: $args) {
      ok
      error
    }
  }
`;

export const CREATE_DOG = gql`
  mutation MCreateDog($args: CreateDogInputDto!) {
    createDog(args: $args) {
      ok
      error
    }
  }
`;
