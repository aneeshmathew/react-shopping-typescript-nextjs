# ShopNext

A modern e-commerce shopping app built with Next.js App Router, demonstrating server components, authentication, and client-side state management.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript 5
- **Styling** — Tailwind CSS v4
- **Auth** — NextAuth v5 (JWT, Credentials provider)
- **State** — Zustand v5 with `persist` middleware
- **Data** — [Fake Store API](https://fakestoreapi.com)

## Getting Started

Create a `.env.local` file in the project root:

```env
AUTH_SECRET=your-secret-key-minimum-32-characters
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
│   ├── page.tsx                   # / (home)
│   ├── layout.tsx                 # Root layout (NavBar, Providers)
│   ├── cart/page.tsx              # /cart (protected)
│   ├── login/page.tsx             # /login
│   ├── products/[id]/page.tsx     # /products/:id (statically generated)
│   └── api/auth/[...nextauth]/    # NextAuth API endpoints
│
├── components/
│   ├── client/                    # "use client" browser components
│   │   ├── Cart.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── LoginForm.tsx
│   │   ├── NavBar.tsx
│   │   └── Providers.tsx
│   └── server/                    # React Server Components
│       ├── Home.tsx
│       ├── Login.tsx
│       ├── ProductDetail.tsx
│       ├── ProductCard.tsx
│       └── ProductList.tsx
│
├── lib/
│   ├── server/                    # Server-only modules
│   │   ├── api.ts                 # Fake Store API (with ISR caching)
│   │   └── auth.ts                # NextAuth configuration
│   └── client/                    # Client-only modules
│       └── store.ts               # Zustand cart store (persisted to localStorage)
│
└── types.ts                       # Shared TypeScript types
```

## Key Concepts

Shopping App

### Server vs Client Components

All product fetching and rendering happens in server components (`components/server/`). No product data fetch logic is shipped to the browser. Client components (`components/client/`) handle only what requires interactivity — cart state, click handlers, and session display.

### Route Protection

`middleware.ts` intercepts requests to `/cart` at the edge before any page renders. Unauthenticated users are redirected to `/login?callbackUrl=/cart` and returned to the cart after signing in.

### Data Caching

API calls in `lib/server/api.ts` use Next.js ISR via `fetch` with `next: { revalidate }`:

| Data | Cache duration |
|---|---|
| Products | 1 hour |
| Categories | 24 hours |

### Static Generation

All `/products/[id]` pages are pre-built at deploy time via `generateStaticParams`, served as static files from a CDN.

### Cart Persistence

The Zustand cart store uses the `persist` middleware to save cart state to `localStorage` under the key `shopping-cart`. The cart survives page refreshes and is restored on the next visit.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
