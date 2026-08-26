import { Suspense } from "react";
import { getCategories } from "@/lib/server/api";
import ProductList from "@/components/server/ProductList";
import ProductFilters from "@/components/client/ProductFilters";
import SearchBar from "@/components/client/SearchBar";
import { formatCategoryLabel } from "@/lib/formatCategoryLabel";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, q, minPrice, maxPrice, minRating } = await searchParams;
  const categories = await getCategories().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {q ? (
              <>Results for &ldquo;{q}&rdquo;</>
            ) : category ? (
              formatCategoryLabel(category)
            ) : (
              "All Products"
            )}
          </h1>
          <p className="text-slate-400 text-sm">
            Discover our curated collection of products
          </p>
        </div>
        <SearchBar initialQuery={q ?? ""} />
      </div>

      <div className="mb-8">
        <Suspense fallback={null}>
          <ProductFilters
            categories={categories}
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minRating={minRating}
          />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 rounded-2xl border border-slate-800 h-80 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <ProductList
          category={category}
          q={q}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
        />
      </Suspense>
    </div>
  );
}
