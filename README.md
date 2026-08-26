# ShopNext

A modern e-commerce shopping app built with Next.js App Router, demonstrating server components, authentication, client-side state management, and search/filtering via URL state.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS v4
- **Auth** — NextAuth v5 (JWT, Credentials provider)
- **State** — Zustand v5 with `persist` middleware
- **Data** — [DummyJSON](https://dummyjson.com)

## Features

- **Product browsing** — server-rendered product grid and detail pages
- **Typeahead search** — debounced live suggestions (title, thumbnail, price) as you type, plus a full search-results view
- **Category filter** — dropdown of all real product categories (not a fixed/hardcoded list)
- **Price range filter** — filter the catalog between a min and max price
- **Star rating filter** — filter to products rated 1★ and up through 4★ and up
- Search, category, price, and rating filters all combine and live in the URL as query params, so results are shareable and bookmarkable
- **Cart** — Zustand-powered, persisted to `localStorage`, protected behind login
- **Auth** — credentials-based sign-in via NextAuth v5

## Getting Started

Create a `.env.local` file in the project root:

```env
AUTH_SECRET=your-secret-key-minimum-32-characters
//generate one with npx auth secret or openssl rand -base64 32
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

```
Email:    demo@example.com
Password: password123
```

## Project Structure

```
src/
├── middleware.ts                  # Edge route protection (/cart requires auth)
│
├── app/                           # Next.js App Router
│   ├── page.tsx                   # / (home — reads category, q, price, rating from the URL)
│   ├── layout.tsx                 # Root layout (NavBar, Providers)
│   ├── cart/page.tsx              # /cart (protected)
│   ├── login/page.tsx             # /login
│   ├── products/[id]/page.tsx     # /products/:id (statically generated, resilient to fetch failures)
│   └── api/auth/[...nextauth]/    # NextAuth API endpoints
│
├── components/
│   ├── client/                    # "use client" browser components
│   │   ├── Cart.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── SearchBar.tsx          # Typeahead product search (debounced suggestions dropdown)
│   │   ├── ProductFilters.tsx     # Category dropdown + price range + star rating filters
│   │   ├── LoginForm.tsx
│   │   ├── NavBar.tsx
│   │   └── Providers.tsx
│   └── server/                    # React Server Components
│       ├── Home.tsx               # Home page layout (heading + search + filters + list)
│       ├── Login.tsx
│       ├── ProductDetail.tsx
│       ├── ProductCard.tsx
│       └── ProductList.tsx        # Fetches and renders the filtered product grid
│
├── lib/
│   ├── server/                    # Server-only modules
│   │   ├── api.ts                 # DummyJSON API client (getProducts, getProduct, getCategories)
│   │   └── auth.ts                # NextAuth configuration
│   ├── client/                    # Client-only modules
│   │   └── store.ts               # Zustand cart store (persisted to localStorage)
│   └── formatCategoryLabel.ts     # Turns a category slug ("home-decoration") into a display label ("Home Decoration")
│
└── types.ts                       # Shared TypeScript types
```

## Key Concepts

### Server vs Client Components

All product fetching and rendering happens in server components (`components/server/`). No product data fetch logic is shipped to the browser. Client components (`components/client/`) handle only what requires interactivity — cart state, search/filter controls, click handlers, and session display.

### Route Protection

`middleware.ts` intercepts requests to `/cart` at the edge before any page renders. Unauthenticated users are redirected to `/login?callbackUrl=/cart` and returned to the cart after signing in.

### Search & Filtering

`SearchBar` and `ProductFilters` write to the URL's query params (`q`, `category`, `minPrice`, `maxPrice`, `minRating`) instead of holding client-side data-fetching state. `Home.tsx` reads those params server-side and passes them to `getProducts()`, so every filter change re-renders the product list on the server. `getProducts()` uses DummyJSON's search/category endpoints where possible and applies price/rating filtering in-memory, since DummyJSON doesn't support combining all of those server-side.

### Data Caching

API calls in `lib/server/api.ts` use Next.js ISR via `fetch` with `next: { revalidate }`:

| Data | Cache duration |
|---|---|
| Products / categories (browse) | 1 hour / 24 hours |
| Search results (`q` present) | Not cached — always fresh |

### Static Generation

`/products/[id]` pages are pre-built at deploy time via `generateStaticParams`, served as static files from a CDN. If the product API is unreachable at build time, `generateStaticParams` falls back to an empty list rather than failing the whole build — those pages then render on-demand at request time instead (the page component already handles a failed fetch gracefully via `notFound()`).

### Cart Persistence

The Zustand cart store uses the `persist` middleware to save cart state to `localStorage` under the key `shopping-cart`. The cart survives page refreshes and is restored on the next visit.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
