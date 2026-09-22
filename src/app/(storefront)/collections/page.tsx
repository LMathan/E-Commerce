"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const COLLECTIONS = [
  {
    id: "smart-home",
    title: "Smart Home Essentials",
    description: "Automate your living space with intelligent minimalist ambient lighting and devices.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    itemCount: "24 Products",
  },
  {
    id: "modern-fashion",
    title: "Modern Minimal Fashion",
    description: "Elevate your daily wardrobe with versatile capsule apparel and premium leather crafts.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    itemCount: "42 Products",
  },
  {
    id: "fitness-gear",
    title: "Fitness & Activewear",
    description: "Train hard and stay healthy with high-grade ergonomic gear and smart wearables.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    itemCount: "18 Products",
  },
  {
    id: "travel-essentials",
    title: "Travel & Outdoor",
    description: "Durable lightweight backpacks, insulated bottles, and travel accessories for your journey.",
    image: "https://images.unsplash.com/photo-1553531384-cc94ac530133?w=800&auto=format&fit=crop&q=80",
    itemCount: "30 Products",
  },
  {
    id: "audio-tech",
    title: "Audio & Tech Gadgets",
    description: "Immersive sound, noise cancellation, and high fidelity wireless headphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    itemCount: "15 Products",
  },
  {
    id: "beauty-care",
    title: "Beauty & Personal Care",
    description: "Nourishing skincare formulations and organic self-care beauty routines.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    itemCount: "28 Products",
  },
];

const DEMO_PRODUCTS = [
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
  },
  {
    id: "p4",
    name: "Minimalist Ergonomic Backpack",
    slug: "minimalist-ergonomic-backpack",
    basePrice: 49.99,
    compareAtPrice: 65.00,
    primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.7,
    totalReviews: 1400,
  },
];

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/60 px-4 py-1.5 text-xs font-extrabold text-amber-900">
          <Layers className="h-3.5 w-3.5 text-amber-600" />
          <span>Exclusive Collections</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif">Curated Collections</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Explore our handpicked thematic product lines designed to bring harmony to your everyday life.
        </p>
      </div>

      {/* Featured Collections Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => (
          <div
            key={col.id}
            onClick={() => setSelectedCollection(col.id)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-900 p-8 min-h-[260px] shadow-sm cursor-pointer hover:shadow-2xl transition-all"
          >
            <Image
              src={col.image}
              alt={col.title}
              fill
              className="object-cover opacity-75 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold text-neutral-900">
                {col.itemCount}
              </span>
            </div>

            <div className="relative z-10 text-white space-y-2">
              <h3 className="text-xl font-bold font-serif">{col.title}</h3>
              <p className="text-xs text-neutral-300 font-normal line-clamp-2">{col.description}</p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-extrabold text-amber-400 group-hover:text-amber-300">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collection Products */}
      <div className="pt-6 border-t border-neutral-200/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 font-serif">Featured Collection Items</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Top performing items across all curated themes</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1">
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEMO_PRODUCTS.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
