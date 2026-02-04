# Nollywood Search

A production-ready, Google-like search experience for Nollywood movies, TV shows, and people. Built with Next.js 15, Apollo Client, and TypeScript.


## Quick Start

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd test

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Run development server
npm run dev
# or
pnpm dev
# or
yarn dev
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
│   └── textUtils.tsx             # Text utilities
└── .env.local                    # Environment variables
```

## How Search Works

### 1. Debouncing
- **300ms delay** prevents excessive API calls
- Uses custom `useDebounce` hook
- Cancels pending requests when user types

### 2. Stale Request Handling
Three-layer protection ensures only the latest results are shown:

1. **Debouncing** - Cancels pending timeouts
2. **Reference Tracking** - `lastTermRef` tracks the latest search term
3. **Apollo Cancellation** - Automatic in-flight request cancellation via `fetchPolicy: 'network-only'`

### 3. User Experience
- **Minimum 2 characters** required to search
- **Loading states** with subtle spinner
- **Keyboard navigation** (Arrow keys, Enter, Escape)
- **Prefetch on hover** for instant page loads
- **Mobile-optimized** dropdown

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
        ... on WorkSearchHit {
          work { id, title, slug, workType }
        }
        ... on PersonSearchHit {
          person { id, name, slug, bio }
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
    id, title, slug, workType
  }
}
```

### Person Detail Query
```graphql
query GetPerson($identifier: String!) {
  getPerson(identifier: $identifier) {
    id, name, slug, bio
  }
}
```

## API Limitations

The GraphQL API does not provide all fields mentioned in the original requirements. The following fields are **not available** in the current schema:

### Search Results
- **Year** - Not available for works in search results
- **Overview** - Not available for works in search results  
- **Primary Role** - Not available for people in search results

### What We Display Instead

**Search Results:**
- **Title/Name** - Available and displayed with highlighting
- **Type Label** - Shows MOVIE, TV_SHOW, or PERSON
- **Snippet** - For works: "Movie" or "TV Show" | For people: Cleaned bio text
- **Bio** - Available for people (cleaned from markdown)

The implementation works with the **available schema fields** and provides a clean fallback experience where data is missing.

## Key Features

- **Debounced Typeahead** - Smooth, responsive search
- **Stale Request Handling** - Always shows latest results
- **Keyboard Navigation** - Full accessibility support
- **Result Count Display** - "Found X works/people"
- **Text Highlighting** - Bold matching terms
- **Prefetch on Hover** - Instant page loads
- **Mobile Optimization** - Responsive design
- **SSR & SEO** - Server-rendered with dynamic metadata
- **Custom Hooks** - Reusable logic (useDebounce, useClickOutside, useKeyboardNavigation)
- **Component Library** - 15+ reusable components

## Architecture Decisions

### Why No State Management Library?
- **Apollo Client** handles all server state (caching, normalization)
- **Local UI state** is minimal and component-scoped

### Custom Hooks
Extracted common patterns for:
- **Reusability** - Use across multiple components

### Component Composition
Created 15+ reusable components:
- **Search components** - CollectionHeader, TypeBadge, SearchResultIcon, SearchResultItem
- **Layout components** - DetailPageLayout, PageTitle, Tag
- **UI components** - Button, Input, Spinner, Card

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
# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## Assumptions Made

1. **API Schema** - Assumed available fields based on GraphQL inspection
2. **Bio Formatting** - Assumed bios may contain markdown (implemented cleaning logic)
3. **Search Collections** - Hardcoded to `['works', 'people']` based on requirements

## Future Improvements

Given more time, I would add:

### Features
- **Search History** - Recent searches with local storage

### Technical
- **Image Optimization** - If API provides images
- **Caching Strategy** - Service worker for offline support

### UX
- **Search Suggestions** - "Did you mean...?"
- **Related Items** - "People also searched for..."
- **Rich Previews** - Show more details on hover
- **Dark Mode** - Theme toggle

