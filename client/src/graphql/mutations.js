/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRanking = /* GraphQL */ `
  mutation CreateRanking(
    $input: CreateRankingInput!
    $condition: ModelRankingConditionInput
  ) {
    createRanking(input: $input, condition: $condition) {
      id
      username
      password
      type
      grupo
      status
      nombre
      bookmark
      avatar
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateRanking = /* GraphQL */ `
  mutation UpdateRanking(
    $input: UpdateRankingInput!
    $condition: ModelRankingConditionInput
  ) {
    updateRanking(input: $input, condition: $condition) {
      id
      username
      password
      type
      grupo
      status
      nombre
      bookmark
      avatar
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteRanking = /* GraphQL */ `
  mutation DeleteRanking(
    $input: DeleteRankingInput!
    $condition: ModelRankingConditionInput
  ) {
    deleteRanking(input: $input, condition: $condition) {
      id
      username
      password
      type
      grupo
      status
      nombre
      bookmark
      avatar
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
