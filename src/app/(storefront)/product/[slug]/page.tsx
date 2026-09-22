"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/currency";
import { useCartContext } from "@/components/providers/CartProvider";
import { useToast } from "@/components/ui/Toaster";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  options: Record<string, string>;
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  createdAt: string;
  user?: { name?: string | null; avatar?: string | null };
}

interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  avgRating: number;
  totalReviews: number;
  images: { id: string; url: string; alt?: string | null }[];
  variants: Variant[];
  reviews: Review[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem, openCart } = useCartContext();
  const { addToast } = useToast();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("Silver");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "faq">("desc");
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product?.images?.[0]?.url) {
            setSelectedImage(data.product.images[0].url);
          }
        } else {
          // Fallback mock PDP data matching Figma screen #3
          setProduct({
            id: "p-headphones",
            name: "NexBeat Pro Wireless Headphones",
            slug: "nexbeat-pro-wireless-headphones",
            brand: "Nexora",
            shortDescription: "Experience immersive sound with premium comfort. Perfect for work, travel and everyday listening with Active Noise Cancellation.",
            description: "Built for true audiophiles, the NexBeat Pro features custom 40mm drivers, active noise cancellation, and up to 40 hours of battery life on a single charge. Soft memory foam earcups ensure all-day comfort.",
            basePrice: 49.99,
            compareAtPrice: 99.99,
            avgRating: 4.8,
            totalReviews: 1492,
            images: [
              { id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
              { id: "2", url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80" },
              { id: "3", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" },
            ],
            variants: [],
            reviews: [],
          });
          setSelectedImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80");
        }
      } catch {
        // Fallback mock
        setProduct({
          id: "p-headphones",
          name: "NexBeat Pro Wireless Headphones",
          slug: "nexbeat-pro-wireless-headphones",
          brand: "Nexora",
          shortDescription: "Experience immersive sound with premium comfort. Perfect for work, travel and everyday listening with Active Noise Cancellation.",
          description: "Built for true audiophiles, the NexBeat Pro features custom 40mm drivers, active noise cancellation, and up to 40 hours of battery life on a single charge. Soft memory foam earcups ensure all-day comfort.",
          basePrice: 49.99,
          compareAtPrice: 99.99,
          avgRating: 4.8,
          totalReviews: 1492,
          images: [
            { id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
            { id: "2", url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80" },
            { id: "3", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" },
          ],
          variants: [],
          reviews: [],
        });
        setSelectedImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  const currentPrice = product.basePrice;
  const comparePrice = product.compareAtPrice;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem({
        productId: product.id,
        productName: product.name,
        price: currentPrice,
        image: selectedImage || product.images[0]?.url,
        quantity,
      });
      openCart();
    } catch {
      addToast({ type: "error", title: "Failed to add to cart" });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-6">
        <Link href="/" className="hover:text-neutral-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-neutral-900">Electronics</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[200px] text-neutral-900 font-bold">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Thumbnails & Main Image Frame (5 cols) */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                  selectedImage === img.url
                    ? "border-amber-500 shadow-sm"
                    : "border-neutral-200/80 bg-neutral-50 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={product.name} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Large Primary Image */}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100/90 order-1 sm:order-2 p-6">
            <Image
              src={selectedImage || product.images[0]?.url}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />

            {/* Top Badge */}
            {comparePrice && comparePrice > currentPrice && (
              <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase text-white shadow-md">
                50% OFF
              </span>
            )}

            {/* Wishlist Heart */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md border border-neutral-200/60"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Right Info Section (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-900 border border-amber-300/60 mb-2">
              Best Seller
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif leading-tight">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900">{product.avgRating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400 font-normal">({product.totalReviews} Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-neutral-900">
              {formatCurrency(currentPrice)}
            </span>
            {comparePrice && (
              <span className="text-base text-neutral-400 line-through">
                {formatCurrency(comparePrice)}
              </span>
            )}
            <span className="rounded-full bg-red-100 text-red-700 font-extrabold text-xs px-2.5 py-0.5">
              50% OFF
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-extrabold text-neutral-900">
              Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
            </label>
            <div className="flex items-center space-x-3">
              {[
                { name: "Silver", bg: "bg-neutral-200" },
                { name: "Matte Black", bg: "bg-neutral-900" },
                { name: "Navy Blue", bg: "bg-blue-900" },
                { name: "Burgundy", bg: "bg-red-800" },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`h-7 w-7 rounded-full ${c.bg} ring-2 transition-all ${
                    selectedColor === c.name ? "ring-amber-500 ring-offset-2 scale-110" : "ring-transparent hover:scale-105"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-extrabold text-neutral-900">Quantity</label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center rounded-2xl border border-neutral-300 bg-neutral-50 px-3 py-1.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-neutral-600 hover:text-neutral-900 p-1"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 text-xs font-extrabold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-neutral-600 hover:text-neutral-900 p-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add to Cart (Black) & Buy Now (Vibrant Amber/Orange) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-neutral-800 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{adding ? "Adding..." : "Add to Cart"}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 text-xs font-extrabold text-neutral-950 shadow-lg shadow-amber-500/25 hover:bg-amber-600 transition-all hover:scale-102"
            >
              <span>Buy Now</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>

          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-200/80 text-center text-xs">
            <div className="flex flex-col items-center">
              <Truck className="h-5 w-5 text-amber-500 mb-1" />
              <span className="font-bold text-neutral-900 text-[11px]">Free Shipping</span>
              <span className="text-[10px] text-neutral-500">Over $50 orders</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="h-5 w-5 text-amber-500 mb-1" />
              <span className="font-bold text-neutral-900 text-[11px]">Easy Returns</span>
              <span className="text-[10px] text-neutral-500">30-day money back</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-5 w-5 text-amber-500 mb-1" />
              <span className="font-bold text-neutral-900 text-[11px]">1 Year Warranty</span>
              <span className="text-[10px] text-neutral-500">Brand original product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Feature Highlights & Specs List */}
      <div className="mt-12 border-t border-neutral-200/80 pt-8">
        <div className="flex border-b border-neutral-200 space-x-8">
          {[
            { id: "desc", label: "Description" },
            { id: "specs", label: "Specifications" },
            { id: "reviews", label: "Reviews (2.4K)" },
            { id: "faq", label: "FAQ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "desc" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-600">
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>Active Noise Cancellation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>40-hour battery life</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>Crystal clear calls</span>
                </li>
              </ul>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>USB-C fast charging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>Lightweight & comfortable</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>Premium sound quality</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Bought Together Section */}
      <div className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50/60 p-6 sm:p-8">
        <h3 className="text-xl font-black text-neutral-900 font-serif mb-6">Frequently Bought Together</h3>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-24 w-24 rounded-2xl bg-white border border-neutral-200 p-2 overflow-hidden shadow-xs">
              <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" alt="Headphones" fill className="object-contain p-1" />
            </div>
            <span className="text-xl font-bold text-neutral-400">+</span>
            <div className="relative h-24 w-24 rounded-2xl bg-white border border-neutral-200 p-2 overflow-hidden shadow-xs">
              <Image src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80" alt="Backpack" fill className="object-contain p-1" />
            </div>
            <span className="text-xl font-bold text-neutral-400">+</span>
            <div className="relative h-24 w-24 rounded-2xl bg-white border border-neutral-200 p-2 overflow-hidden shadow-xs">
              <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" alt="Shoes" fill className="object-contain p-1" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-neutral-500 font-bold">Total Combo Price:</p>
              <p className="text-2xl font-black text-neutral-900">$129.97 <span className="text-xs line-through text-neutral-400">$165.00</span></p>
            </div>
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-neutral-950 px-6 py-3 text-xs font-extrabold text-white hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-md"
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
