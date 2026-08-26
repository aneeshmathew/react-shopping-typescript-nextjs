// DummyJSON (docs: https://dummyjson.com/docs/products). Originally this
// hit fakestoreapi.com, but that API sits behind a Cloudflare bot challenge
// that blocks server-side requests from Vercel (returns a "Just a
// moment..." HTML page instead of JSON — works fine from a browser/local
// dev, fails in production). Platzi's Fake Store API (escuelajs.co) was
// tried next, but it's a shared, publicly-writable dataset polluted with
// years of other developers' test/junk products and categories.
// DummyJSON's write endpoints are simulated only (nothing is ever
// persisted), so its catalog stays clean, and it has no known
// Cloudflare-blocking issues.
import type { Product, ProductQueryOptions } from "@/types";

const BASE_URL = "https://dummyjson.com";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/json",
};

interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  rating?: number;
  reviews?: unknown[];
}

interface DummyJsonProductList {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

type DummyJsonCategory = string | { slug: string; name: string; url: string };

async function throwWithDetail(res: Response, label: string): Promise<never> {
  const body = await res.text().catch(() => "");
  throw new Error(
    `${label}: HTTP ${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ""}`
  );
}

async function apiFetch<T>(
  path: string,
  { revalidate }: { revalidate?: number } = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: DEFAULT_HEADERS,
    next: revalidate ? { revalidate } : undefined,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) await throwWithDetail(res, `Failed to fetch ${path}`);
  return res.json();
}

function normalizeProduct(p: DummyJsonProduct): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail || p.images?.[0] || "https://placehold.co/600x400",
    rating: {
      rate:
        typeof p.rating === "number" ? Math.round(p.rating * 10) / 10 : 4.5,
      count: Array.isArray(p.reviews) ? p.reviews.length : 0,
    },
  };
}

export async function getProducts({
  category,
  q,
  minPrice,
  maxPrice,
  minRating,
}: ProductQueryOptions = {}): Promise<Product[]> {
  // DummyJSON's search endpoint doesn't accept a category filter, and the
  // category endpoint doesn't accept a search term — so when a text query is
  // present we search first (it's the more restrictive filter) and narrow to
  // the category client-side; otherwise we fetch by category directly.
  const path = q
    ? `/products/search?q=${encodeURIComponent(q)}&limit=0`
    : category
      ? `/products/category/${encodeURIComponent(category)}?limit=0`
      : "/products?limit=0";

  // Search results shouldn't be cached the way the general catalog is —
  // every distinct query would otherwise get its own cache entry forever.
  const data = await apiFetch<DummyJsonProductList>(path, {
    revalidate: q ? undefined : 3600,
  });
  let products = (data.products ?? []).map(normalizeProduct);

  if (q && category) {
    products = products.filter((p) => p.category === category);
  }
  if (typeof minPrice === "number" && !Number.isNaN(minPrice)) {
    products = products.filter((p) => p.price >= minPrice);
  }
  if (typeof maxPrice === "number" && !Number.isNaN(maxPrice)) {
    products = products.filter((p) => p.price <= maxPrice);
  }
  if (typeof minRating === "number" && !Number.isNaN(minRating)) {
    products = products.filter((p) => p.rating.rate >= minRating);
  }
  return products;
}

export async function getProduct(id: number): Promise<Product> {
  const p = await apiFetch<DummyJsonProduct>(`/products/${id}`, {
    revalidate: 3600,
  });
  return normalizeProduct(p);
}

export async function getCategories(): Promise<string[]> {
  const data = await apiFetch<DummyJsonCategory[]>("/products/categories", {
    revalidate: 86400,
  });
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}
