/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRanking = /* GraphQL */ `
  query GetRanking($id: ID!) {
    getRanking(id: $id) {
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
export const listRankings = /* GraphQL */ `
  query ListRankings(
    $filter: ModelRankingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRankings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncRankings = /* GraphQL */ `
  query SyncRankings(
    $filter: ModelRankingFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRankings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
