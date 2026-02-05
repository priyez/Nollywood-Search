# Nollywood Search

A Google-like search experience for Nollywood movies, TV shows, and people. Built with Next.js, Apollo Client, and TypeScript.


## Quick Start

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/priyez/Nollywood-Search.git
cd Nollywood-Search

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── work/[slug]/page.tsx      # Work detail page
│   └── person/[slug]/page.tsx    # Person detail page
├── components/
│   ├── SearchBox.tsx             # Search input with logic
│   ├── SearchResults.tsx         # Results display
│   ├── search/                   # Search-specific components
│   ├── layout/                   # Layout components
│   └── ui/                       # Reusable UI components
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts
│   ├── useClickOutside.ts
│   └── useKeyboardNavigation.ts
├── lib/
│   ├── apollo-client.ts          # Apollo Client setup
│   ├── queries.ts                # GraphQL queries
│   ├── metadata.ts               # Metadata for SEO
│   └── textUtils.tsx             # Text utilities
└── .env.local                    # Environment variables
```

## How Search Works

### 1. Debouncing
- **300ms delay** prevents excessive API calls
- Cancels pending requests when user types

### 2. Role Detection (Smart role labeling)
Since the API doesn't return a primary role for people in search results, I implemented a smart role labeling in `lib/textUtils.tsx`:
- Scans bio text for keywords like "actor", "director", "producer".
- Dynamically assigns specific `TypeBadge` labels (e.g., ACTOR, DIRECTOR).

### 3. Error Resilience & Partial Data
The application is designed to be resilient to backend inconsistencies:
- **Apollo Error Policy**: Set to `all` to allow rendering partial data even if some sub-queries fail.
- **Defensive Rendering**: Null-checks in `SearchResultItem` and `SearchResults` prevent crashes from malformed data.
- **Graceful Fallbacks**: Shows friendly "No results found" instead of raw errors for common "not found" scenarios.

## GraphQL Operations

### Search Query
```graphql
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
```

### Work Detail Query
```graphql
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
```

### Person Detail Query
```graphql
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
```

## Key Features

- **Debounced Typeahead** - Smooth, responsive search with dynamic results.
- **Global Search Header** - Search from anywhere (Home, Person, or Work detail pages).
- **Dynamic Role Detection** - Smart role labeling (Actor, Director, Producer) for people.
- **Error Resilience** - Robust handling of partial API failures using `errorPolicy: 'all'`.
- **Keyboard Navigation** - Full accessibility support (Arrow keys, Enter, Escape).
- **Text Highlighting** - Bold matching terms in real-time.
- **Prefetch on Hover** - Instant page transitions using Next.js prefetching.
- **Mobile Optimization** - Responsive design with custom dropdown layouts.
- **Centralized Utilities** - Shared logic for age calculation, biographic cleaning, and date formatting.
- **SSR & SEO** - Server-rendered with dynamic metadata for every page.


## Environment Variables

The GraphQL endpoint is configured in `lib/apollo-client.ts`:

```typescript
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});
```

To use a different endpoint, update this file or create a `.env.local`:



## Testing

```bash

# Build for production
npm run build

# Start production server
npm start
```

## Assumptions Made

1. **API Schema** - Structure and fields were derived from live GraphQL introspection.
2. **Bio Formatting** - Assumed bios may contain markdown or raw text (implemented cleaning/normalization logic).
3. **Role Inference** - Since the API doesn't provide a "primary role", i assume keywords in the biography are reliable indicators for role labeling.
4. **Search Scope** - Explicitly scoped to `['works', 'people']` per requirements.

## Future Improvements

- **Search History** - Persistent recent searches using local storage.
- **Advanced Filtering** - Ability to filter results by year, genre, or role.
- **Skeleton Loading** - Better perceived performance with skeleton states instead of spinners.
- **Dark Mode** - Full systemic support for dark/high-contrast themes.


