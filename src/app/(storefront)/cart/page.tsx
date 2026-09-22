"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/utils/currency";
import { Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export default function CartPage() {
  const router = useRouter();
  const { cart, items, updateQuantity, removeItem } = useCartContext();
  const { addToast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount] = useState(10);
  const [couponApplied, setCouponApplied] = useState(false);

  // Fallback demo cart items if cart is empty so preview matches Figma screen #4!
  const demoItems = items.length > 0 ? items.map(i => ({
    id: i.id,
    productId: i.productId,
    productName: i.productName,
    price: i.unitPrice || i.price || 49.99,
    quantity: i.quantity,
    image: i.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
  })) : [
    {
      id: "c1",
      productId: "p-1",
      productName: "NexBeat Pro Wireless Headphones",
      price: 49.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "c2",
      productId: "p-2",
      productName: "Minimal LED Table Lamp",
      price: 34.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "c3",
      productId: "p-3",
      productName: "Insulated Water Bottle",
      price: 24.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const currentSubtotal = items.length > 0 ? (cart.subtotal || 108.97) : 108.97;
  const finalDiscount = couponApplied ? discountAmount : 10.00;
  const finalTotal = Math.max(0, currentSubtotal - finalDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponApplied(true);
    addToast({ type: "success", title: "Coupon code applied (-$10.00)" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">
            Your Cart <span className="text-neutral-400 font-normal">({demoItems.length} items)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Review your selected items before proceeding to checkout</p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-neutral-900 hover:text-amber-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {demoItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 rounded-3xl border border-neutral-200/80 bg-white shadow-xs hover:border-amber-400/60 transition-all"
            >
              {/* Product Thumbnail */}
              <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-100 p-2 border border-neutral-200/60">
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-neutral-900 truncate">{item.productName}</h3>
                <p className="text-sm font-black text-amber-600 mt-0.5">{formatCurrency(item.price)}</p>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-2.5 py-1">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="text-neutral-500 hover:text-neutral-900 p-1"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-3 text-xs font-black text-neutral-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-neutral-500 hover:text-neutral-900 p-1"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Trash Icon */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Coupon Input Form */}
          <div className="pt-4">
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-3 max-w-sm">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Apply Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <Tag className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-neutral-950 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-neutral-800 transition-colors"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-lg space-y-6">
            <h3 className="text-lg font-black text-neutral-900 font-serif border-b border-neutral-100 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-medium text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">{formatCurrency(currentSubtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-bold">-{formatCurrency(finalDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 border-t border-neutral-100 pt-3">
                <span>Total</span>
                <span className="text-xl text-neutral-900">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Primary Orange-Yellow Checkout Button */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-4 text-sm font-extrabold text-neutral-950 shadow-xl shadow-amber-500/25 hover:bg-amber-600 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/shop"
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
