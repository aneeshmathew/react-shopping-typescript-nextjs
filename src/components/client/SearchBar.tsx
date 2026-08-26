"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SearchBarProps {
  initialQuery?: string;
}

interface SearchSuggestion {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (term.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            term
          )}&limit=6&select=id,title,thumbnail,price`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        setSuggestions(data.products ?? []);
        setIsOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("q", term);
    else params.delete("q");
    setIsOpen(false);
    router.push(`/?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(query.trim());
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-72">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search products..."
            className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-20 mt-2 w-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl shadow-black/40 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Searching…</div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-9 h-9 object-contain rounded-md bg-slate-800/80 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-100 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">${item.price?.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => submitSearch(query.trim())}
                className="w-full text-left px-3 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10 border-t border-slate-800 transition-colors"
              >
                See all results for &ldquo;{query.trim()}&rdquo;
              </button>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
