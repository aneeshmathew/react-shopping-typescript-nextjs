import { getProducts } from "@/lib/server/api";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductListProps {
  category?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
}

function toNumber(value?: string): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export default async function ProductList({
  category,
  q,
  minPrice,
  maxPrice,
  minRating,
}: ProductListProps) {
  let products: Product[] = [];
  let hasError = false;

  try {
    products = await getProducts({
      category,
      q,
      minPrice: toNumber(minPrice),
      maxPrice: toNumber(maxPrice),
      minRating: toNumber(minRating),
    });
  } catch (err) {
    console.error("ProductList: failed to fetch products", err);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="text-center py-20 text-slate-400">
        We couldn&apos;t load products right now. Please try again in a moment.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        No products match your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
