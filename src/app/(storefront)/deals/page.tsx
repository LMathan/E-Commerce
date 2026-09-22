"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag, ArrowRight, Flame, Percent, Zap } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

const DEAL_BANNERS = [
  {
    id: "d1",
    badge: "50% OFF FLASH SALE",
    title: "Audio & Tech Super Sale",
    description: "Get half price on NexBeat Pro headphones, wireless earbuds, and portable Bluetooth speakers.",
    code: "FLASH50",
    bg: "bg-gradient-to-r from-red-600 via-orange-600 to-amber-500",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "d2",
    badge: "BUY 1 GET 1 30% OFF",
    title: "Home & Living Aesthetics",
    description: "Upgrade your ambient lighting, minimal vase decors, and ergonomic table lamps today.",
    code: "HOME30",
    bg: "bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "d3",
    badge: "CLEARANCE UP TO 60% OFF",
    title: "End of Season Clearance",
    description: "Limited inventory remaining on footwear, activewear, and travel gear.",
    code: "CLEARANCE60",
    bg: "bg-gradient-to-r from-neutral-900 to-neutral-800",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  },
];

const DISCOUNTED_PRODUCTS = [
  {
    id: "dp1",
    name: "NexBeat Pro Wireless Headphones",
    slug: "nexbeat-pro-wireless-headphones",
    basePrice: 49.99,
    compareAtPrice: 99.99,
    primaryImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.8,
    totalReviews: 1492,
    isOnSale: true,
  },
  {
    id: "dp2",
    name: "Modern LED Table Lamp",
    slug: "modern-led-table-lamp",
    basePrice: 34.99,
    compareAtPrice: 45.00,
    primaryImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.7,
    totalReviews: 1900,
    isOnSale: true,
  },
  {
    id: "dp3",
    name: "NexFit Smartwatch Series 5",
    slug: "nexfit-smartwatch-series-5",
    basePrice: 79.99,
    compareAtPrice: 99.99,
    primaryImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.9,
    totalReviews: 3200,
    isOnSale: true,
  },
  {
    id: "dp4",
    name: "UrbanFlex Running Shoes",
    slug: "urbanflex-running-shoes",
    basePrice: 59.99,
    compareAtPrice: 79.99,
    primaryImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    avgRating: 4.6,
    totalReviews: 1100,
    isOnSale: true,
  },
];

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-100/60 px-4 py-1.5 text-xs font-extrabold text-red-700">
          <Flame className="h-3.5 w-3.5 text-red-600 fill-red-600" />
          <span>Exclusive Offers & Sales</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif">Deals & Promotional Offers</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Save big with limited-time flash discounts, coupon promo codes, and clearance bundles.
        </p>
      </div>

      {/* List of Deal Banners */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-neutral-900 font-serif flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
          <span>Active Deal Campaigns</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEAL_BANNERS.map((deal) => (
            <div
              key={deal.id}
              className={`group relative overflow-hidden rounded-3xl ${deal.bg} text-white p-6 sm:p-8 flex flex-col justify-between min-h-[260px] shadow-xl`}
            >
              <div className="relative z-10 space-y-3 max-w-xs">
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/30">
                  {deal.badge}
                </span>
                <h3 className="text-xl font-black font-serif leading-tight">{deal.title}</h3>
                <p className="text-xs text-white/90 leading-relaxed font-normal">{deal.description}</p>
                
                <div className="pt-2 flex items-center gap-2 text-xs font-black">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl font-mono text-amber-200">
                    Use Code: {deal.code}
                  </span>
                </div>
              </div>

              {/* Product Image Overlay */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none opacity-80 group-hover:scale-105 transition-transform duration-500">
                <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On-Sale Discounted Products */}
      <div className="pt-6 border-t border-neutral-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 font-serif">Top Discounted Products</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Instant discounts applied on checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {DISCOUNTED_PRODUCTS.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
