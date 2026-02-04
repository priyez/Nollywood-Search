import { gql } from '@apollo/client';

export const SEARCH_QUERY = gql`
  query Search($input: SearchInput!) {
    search(input: $input) {
      collections {
        name
        displayName
        found
        hits {
          __typename
          ... on WorkSearchHit {
            work {
              id
              title
              slug
              workType
            }
          }
          ... on PersonSearchHit {
            person {
              id
              name
              slug
              bio
            }
          }
        }
      }
    }
  }
`;

export const GET_WORK = gql`
  query GetWork($identifier: String!) {
    getWork(identifier: $identifier) {
      id
      title
      slug
      workType
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($identifier: String!) {
    getPerson(identifier: $identifier) {
      id
      name
      slug
      bio
    }
  }
`;


export interface SearchInput {
  term: string;
  collections?: string[];
}

export type WorkType = 'MOVIE' | 'TV_SHOW';

export interface Work {
  id: string;
  title: string;
  slug: string;
  workType: WorkType;
}

export interface Person {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
}

export interface WorkSearchHit {
  __typename: 'WorkSearchHit';
  work: Work;
}

export interface PersonSearchHit {
  __typename: 'PersonSearchHit';
  person: Person;
}

export type SearchHit = WorkSearchHit | PersonSearchHit;

export interface Collection {
  name: string;
  displayName: string;
  found: number;
  hits: SearchHit[];
}

export interface SearchData {
  search: {
    collections: Collection[];
  };
}

export interface WorkData {
  getWork: Work;
}

export interface PersonData {
  getPerson: Person;
}
