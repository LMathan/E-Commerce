"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useCartContext } from "@/components/providers/CartProvider";
import { useToast } from "@/components/ui/Toaster";
import { formatCurrency } from "@/utils/currency";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  primaryImage?: string | null;
  images?: { url: string }[];
  avgRating?: number | null;
  totalReviews?: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  brand?: string | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartContext();
  const { addToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const imageSrc =
    product.primaryImage ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? Math.round(
          ((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100
        )
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await addItem({
        productId: product.id,
        productName: product.name,
        price: product.basePrice,
        image: imageSrc,
        quantity: 1,
      });
      addToast({ type: "success", title: "Added to Cart" });
    } catch {
      addToast({ type: "error", title: "Failed to add to cart" });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(data.isWishlisted);
        addToast({
          type: "success",
          title: data.isWishlisted ? "Added to Wishlist" : "Removed from Wishlist",
        });
      } else {
        addToast({ type: "error", title: "Please log in to save items" });
      }
    } catch {
      addToast({ type: "error", title: "Wishlist error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-xl"
    >
      {/* Image Frame Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-neutral-100/90 p-4">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain object-center p-2 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges on Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent ? (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : product.isBestseller ? (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neutral-950 shadow-xs">
              Best Seller
            </span>
          ) : product.isNewArrival ? (
            <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-xs">
              New
            </span>
          ) : null}
        </div>

        {/* Wishlist Button on Top-Right */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-600 border border-neutral-200/60 shadow-xs transition-all hover:bg-neutral-50 hover:text-red-500 z-10"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </Link>

      {/* Card Content Section */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 bg-white justify-between space-y-3">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 transition-colors hover:text-amber-600 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating & Review Count */}
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-neutral-900">
              {(product.avgRating || 4.8).toFixed(1)}
            </span>
            <span className="text-[10px] text-neutral-400 font-normal">
              ({product.totalReviews || 2.4}K)
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-base sm:text-lg font-black text-neutral-900">
              {formatCurrency(product.basePrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Full Width Dark Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-amber-500 hover:text-neutral-950 transition-colors"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>
    </motion.div>
  );
}
