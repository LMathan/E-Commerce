"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const NEW_ARRIVALS_PRODUCTS = [
  {
    id: "na1",
    name: "NexBeat Pro Wireless Headphones",
    slug: "nexbeat-pro-wireless-headphones",
    basePrice: 49.99,
    compareAtPrice: 99.99,
    primaryImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.8,
    totalReviews: 1492,
    isNewArrival: true,
  },
  {
    id: "na2",
    name: "Minimalist Chrono Watch",
    slug: "minimalist-chrono-watch",
    basePrice: 89.99,
    compareAtPrice: 120.00,
    primaryImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.9,
    totalReviews: 310,
    isNewArrival: true,
  },
  {
    id: "na3",
    name: "Genuine Leather Slim Wallet",
    slug: "genuine-leather-slim-wallet",
    basePrice: 29.99,
    compareAtPrice: 45.00,
    primaryImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.7,
    totalReviews: 88,
    isNewArrival: true,
  },
  {
    id: "na4",
    name: "ProFit Running Shoes V2",
    slug: "profit-running-shoes-v2",
    basePrice: 69.99,
    compareAtPrice: 89.99,
    primaryImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.8,
    totalReviews: 240,
    isNewArrival: true,
  },
];

export default function NewArrivalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-extrabold text-amber-400 border border-amber-500/30">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Just Dropped • Spring 2026</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif leading-tight">
            Fresh Arrivals,<br />Next-Gen Design
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Be the first to experience our latest release of innovative home, tech, and lifestyle essentials.
          </p>
          <div className="pt-2">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-extrabold text-neutral-950 shadow-lg hover:bg-amber-600 transition-colors"
            >
              <span>Explore New Releases</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
            alt="New Arrival Headphones"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* New Arrivals Product Grid */}
      <div id="products" className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 font-serif">Latest Release Catalog</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Freshly added products in stock for immediate dispatch</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {NEW_ARRIVALS_PRODUCTS.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
