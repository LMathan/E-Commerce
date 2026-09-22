"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import {
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  RotateCcw,
  Star,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  primaryImage?: string | null;
  avgRating?: number;
  totalReviews?: number;
}

const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Beats", "Bose"];
const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "SoundPro X1 Wireless Earbuds",
    slug: "soundpro-x1-wireless-earbuds",
    basePrice: 49.99,
    compareAtPrice: 60.00,
    primaryImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.8,
    totalReviews: 2400,
    isBestseller: true,
    brand: "SoundPro",
  },
  {
    id: "p2",
    name: "Modern LED Table Lamp",
    slug: "modern-led-table-lamp",
    basePrice: 34.99,
    compareAtPrice: 45.00,
    primaryImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.7,
    totalReviews: 1900,
    isBestseller: true,
    brand: "LumiHome",
  },
  {
    id: "p3",
    name: "NexFit Smartwatch Series 5",
    slug: "nexfit-smartwatch-series-5",
    basePrice: 79.99,
    compareAtPrice: 99.99,
    primaryImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.9,
    totalReviews: 3200,
    isBestseller: true,
    brand: "NexFit",
  },
  {
    id: "p4",
    name: "UrbanFlex Running Shoes",
    slug: "urbanflex-running-shoes",
    basePrice: 59.99,
    compareAtPrice: 79.99,
    primaryImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.6,
    totalReviews: 1100,
    isBestseller: false,
    brand: "UrbanFlex",
  },
  {
    id: "p5",
    name: "Insulated Stainless Steel Bottle",
    slug: "insulated-water-bottle",
    basePrice: 24.99,
    compareAtPrice: 35.00,
    primaryImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.8,
    totalReviews: 850,
    isBestseller: true,
    brand: "HydroVibe",
  },
  {
    id: "p6",
    name: "Minimalist Ergonomic Backpack",
    slug: "minimalist-ergonomic-backpack",
    basePrice: 49.99,
    compareAtPrice: 65.00,
    primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.7,
    totalReviews: 1400,
    isBestseller: false,
    brand: "PackPro",
  },
];

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("query", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedBrand) params.set("brand", selectedBrand);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">
            {selectedCategory
              ? selectedCategory.replace("-", " ").toUpperCase()
              : "Shop Catalog"}
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Explore curated products with instant dispatch & express warranty
          </p>
        </div>

        {/* Controls */}
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden flex items-center gap-2 rounded-full border-neutral-300 text-xs font-bold"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-full border border-neutral-200/90 bg-neutral-50 py-2 pl-4 pr-9 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-xs"
            >
              <option value="newest">Sort by: Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          </div>

          {/* Grid/List Toggle */}
          <div className="hidden sm:flex items-center rounded-full border border-neutral-200 bg-neutral-100 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "grid" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === "list" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-500" />
              <span>Filters</span>
            </h3>
            {(selectedCategory || selectedBrand || minPrice || maxPrice || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Category</label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium ${
                  selectedCategory === ""
                    ? "bg-amber-500/10 text-amber-600 font-extrabold"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                All Categories
              </button>
              {["electronics", "home-living", "fashion", "beauty-care", "sports-fitness", "travel", "accessories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors capitalize ${
                    selectedCategory === cat
                      ? "bg-amber-500/10 text-amber-600 font-extrabold"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {cat.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Price Range ($)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 px-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-neutral-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 px-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Brand Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Brand</label>
            <div className="space-y-2 text-xs">
              {BRANDS.map((b) => (
                <label key={b} className="flex items-center space-x-2.5 cursor-pointer text-neutral-700 hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={selectedBrand === b}
                    onChange={() => setSelectedBrand(selectedBrand === b ? "" : b)}
                    className="rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Rating</label>
            <div className="space-y-1 text-xs">
              <button className="flex items-center space-x-1 text-amber-500 font-bold hover:text-amber-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
                <span className="text-neutral-700 ml-1 font-normal">& Above</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-neutral-200 p-4 space-y-4">
                  <div className="aspect-square bg-neutral-100 rounded-2xl" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
