"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  primaryImage?: string | null;
  avgRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  brand?: string | null;
}

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
}

const CATEGORY_TABS = ["All", "Electronics", "Home", "Fashion", "Beauty", "Fitness"];

export function FeaturedProducts({
  products,
  title = "Trending Now",
  subtitle = "Most loved products by our customers",
  viewAllHref = "/shop",
  className = "",
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("All");

  if (!products || products.length === 0) return null;

  return (
    <section className={`py-12 bg-white border-b border-neutral-200/80 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title & View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-serif">
              {title}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-neutral-500">{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
