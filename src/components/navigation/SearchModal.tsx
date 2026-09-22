"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  image?: string | null;
  category?: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["Electronics", "Running Shoes", "Leather Wallet", "Headphones"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Debounced search
  const searchProducts = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data?.products ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveSearch(term.trim());
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1300] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="fixed top-0 left-0 right-0 z-[1400] animate-slide-in-up"
      >
        <div className="bg-white shadow-2xl border-b border-neutral-200">
          <div className="container">
            {/* Search input */}
            <div className="relative flex items-center gap-3 py-4">
              <Search className="h-5 w-5 text-neutral-400 flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                placeholder="Search products, categories, brands..."
                className="flex-1 text-base text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none border-0"
                autoComplete="off"
                autoCorrect="off"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close search"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 px-2 py-1"
              >
                Cancel
              </button>
            </div>

            {/* Results / suggestions */}
            <div className="pb-4 max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center gap-2 px-2 py-3 text-sm text-neutral-500">
                  <div className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-neutral-700 animate-spin" />
                  Searching...
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                    Products
                  </p>
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/products/${result.slug}`}
                      onClick={() => { saveSearch(result.name); onClose(); }}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
                        {result.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neutral-100" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{result.name}</p>
                        {result.category && (
                          <p className="text-xs text-neutral-500">{result.category}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {formatCurrency(result.basePrice)}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => { saveSearch(query); onClose(); }}
                    className="block mt-2 text-center text-sm text-blue-600 hover:underline py-2"
                  >
                    See all results for &quot;{query}&quot;
                  </Link>
                </div>
              )}

              {!isLoading && query.length >= 2 && results.length === 0 && (
                <p className="text-sm text-neutral-500 py-3 px-2">
                  No results for &quot;{query}&quot;. Try a different keyword.
                </p>
              )}

              {!query && (
                <div className="space-y-4">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="text-sm px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" /> Popular
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="text-sm px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
