"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCategoryLabel } from "@/lib/formatCategoryLabel";
import type { Category } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
}

const RATING_OPTIONS = [4, 3, 2, 1];

export default function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  minRating,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ category: e.target.value });
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ minPrice: minPriceInput, maxPrice: maxPriceInput });
  };

  const handleRatingClick = (rating: number) => {
    updateParams({
      minRating: String(minRating) === String(rating) ? undefined : String(rating),
    });
  };

  const hasActiveFilters = Boolean(
    selectedCategory || minPrice || maxPrice || minRating
  );

  const clearAll = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push("/");
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Category
        </label>
        <select
          value={selectedCategory ?? ""}
          onChange={handleCategoryChange}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[180px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategoryLabel(cat)}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handlePriceSubmit} className="flex items-end gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Min price
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            placeholder="$0"
            className="w-24 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Max price
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            placeholder="Any"
            className="w-24 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Apply
        </button>
      </form>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Rating
        </label>
        <div className="flex gap-1.5">
          {RATING_OPTIONS.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                String(minRating) === String(rating)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              <span className="text-yellow-400">★</span>
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
