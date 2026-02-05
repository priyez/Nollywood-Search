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
              releaseYear
              workType
              poster {
                url
                thumbnailImageUrl
                altText
              }
            }
          }
          ... on PersonSearchHit {
            person {
              id
              name
              slug
              bio
              headshot {
                url
                thumbnailImageUrl
                altText
              }
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
      summary
      synopsis
      releaseDate
      releaseYear
      runtime
      contentRating
      isStreamable
      isInTheatre
      languages
      spokenLanguages
      poster {
        id
        url
        thumbnailImageUrl
        title
        altText
        description
      }
      backdrop {
        id
        url
        thumbnailImageUrl
        title
        altText
        description
      }
      trailer {
        id
        url
        thumbnailImageUrl
        title
        altText
        description
      }
      genres {
        id
        name
        slug
        description
      }
      themes {
        id
        name
        slug
        description
      }
      cast {
        id
        role
        department
        characterName
        isLead
        isFeatured
        person {
          id
          name
          slug
          headshot {
            url
            thumbnailImageUrl
            altText
          }
        }
      }
      crew {
        id
        role
        department
        person {
          id
          name
          slug
          headshot {
            url
            thumbnailImageUrl
            altText
          }
        }
      }
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
      age
      gender
      aliases
      nationality
      deceased
      birthDate
      birthName
      birthPlace
      deathDate
      status 
      verified
      featured
      externalLinks {
        url
        label
        icon
        platform
      }
      headshot {
        url
        thumbnailImageUrl
        altText
      }
      works {
        items {
          id
          title
          slug
          workType
          releaseYear
          poster {
            url
            thumbnailImageUrl
            altText
          }
        }
      }
    }
  }
`;



export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Person {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  age: number | null;
  gender: string | null;
  aliases: string[];
  nationality: string[];
  deceased: boolean;
  birthDate: string | null;
  birthName: string | null;
  birthPlace: string | null;
  deathDate: string | null;
  status: string;
  verified: boolean;
  featured: boolean;
  externalLinks: ExternalLink[];
  headshot?: Headshot;
  works?: {
    items: Work[];
  };
}

export interface CastMember {
  id: string;
  role: string;
  department: string;
  characterName: string | null;
  isLead: boolean;
  isFeatured: boolean;
  person: Person;
}

export interface CrewMember {
  id: string;
  role: string;
  department: string;
  person: Person;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  workType: WorkType;
  summary: string | null;
  synopsis: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  runtime: number | null;
  contentRating: string | null;
  isStreamable: boolean;
  isInTheatre: boolean;
  languages: string[];
  spokenLanguages: string[];
  poster?: Poster;
  backdrop?: Poster; // Reusing Poster interface as fields are similar enough, or create ImageAsset
  trailer?: Trailer;
  genres: Genre[];
  themes: Theme[];
  cast: CastMember[];
  crew: CrewMember[];
}



export interface SearchInput {
  term: string;
  collections?: string[];
}

export type WorkType = 'MOVIE' | 'TV_SHOW';

export interface Poster {
  url: string;
  thumbnailImageUrl: string;
  altText: string | null;
  primaryColor?: string;
}

export interface Headshot {
  url: string;
  thumbnailImageUrl: string;
  altText: string | null;
}

export interface Trailer {
  url: string;
  thumbnailImageUrl: string;
  title: string;
}

export interface ExternalLink {
  url: string;
  label: string | null;
  icon: string | null;
  platform: string | null;
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
