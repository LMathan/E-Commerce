"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/utils/currency";
import { ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, items } = useCartContext();
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    email: "nathan@example.com",
    firstName: "Nathan",
    lastName: "L",
    address: "123 Main Street",
    apartment: "Apt 4B",
    country: "United States",
    state: "California",
    city: "San Francisco",
    zip: "94105",
    shippingMethod: "standard",
  });

  const demoItems = items.length > 0 ? items.map(i => ({
    id: i.id,
    productName: i.productName,
    price: i.unitPrice || i.price || 49.99,
    quantity: i.quantity,
    image: i.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
  })) : [
    { id: "c1", productName: "NexBeat Pro Wireless Headphones", price: 49.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" },
    { id: "c2", productName: "Minimal LED Table Lamp", price: 34.99, quantity: 1, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80" },
    { id: "c3", productName: "Insulated Water Bottle", price: 24.99, quantity: 1, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80" },
  ];

  const currentSubtotal = items.length > 0 ? (cart.subtotal || 108.97) : 108.97;
  const shippingFee = formData.shippingMethod === "express" ? 9.99 : formData.shippingMethod === "nextday" ? 15.99 : 4.99;
  const discount = 10.00;
  const grandTotal = Math.max(0, currentSubtotal - discount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => (s + 1) as any);
      return;
    }

    setLoading(true);
    try {
      addToast({ type: "success", title: "Order placed successfully!" });
      router.push("/checkout/success?orderNumber=NX-984210");
    } catch {
      addToast({ type: "error", title: "Checkout error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* 3 Step Process Bar */}
      <div className="flex items-center justify-center max-w-md mx-auto mb-10 text-xs font-bold">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-amber-600" : "text-neutral-400"}`}>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-neutral-950 font-black">1</span>
          <span>Information</span>
        </div>
        <ChevronRight className="h-4 w-4 mx-3 text-neutral-300" />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-amber-600" : "text-neutral-400"}`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 2 ? "bg-amber-500 text-neutral-950" : "bg-neutral-200 text-neutral-600"} font-black`}>2</span>
          <span>Shipping</span>
        </div>
        <ChevronRight className="h-4 w-4 mx-3 text-neutral-300" />
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-amber-600" : "text-neutral-400"}`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= 3 ? "bg-amber-500 text-neutral-950" : "bg-neutral-200 text-neutral-600"} font-black`}>3</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Section (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs">
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-neutral-900 font-serif">Contact Information</h2>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nathan@example.com"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-black text-neutral-900 font-serif">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-black text-neutral-900 font-serif">Shipping Method</h2>
              <div className="space-y-2">
                {[
                  { id: "standard", label: "Standard Shipping (5-7 days)", price: 4.99 },
                  { id: "express", label: "Express Shipping (2-3 days)", price: 9.99 },
                  { id: "nextday", label: "Next Day Delivery (1 day)", price: 15.99 },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.shippingMethod === m.id
                        ? "border-amber-500 bg-amber-50/50 font-bold"
                        : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs text-neutral-900">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shippingMethod === m.id}
                        onChange={() => setFormData({ ...formData, shippingMethod: m.id })}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{m.label}</span>
                    </div>
                    <span className="text-xs font-black text-neutral-900">{formatCurrency(m.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-neutral-950 py-4 text-xs font-extrabold text-white hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-md"
            >
              {loading ? "Processing..." : step === 3 ? "Complete Order" : "Continue to Payment"}
            </button>
          </form>
        </div>

        {/* Right Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-md space-y-6">
            <h3 className="text-lg font-black text-neutral-900 font-serif border-b border-neutral-100 pb-4">
              Order Summary
            </h3>

            {/* Items List Preview */}
            <div className="space-y-3">
              {demoItems.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200">
                      <Image src={it.image} alt={it.productName} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 line-clamp-1">{it.productName}</p>
                      <p className="text-neutral-400">Qty: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-neutral-900">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">{formatCurrency(currentSubtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-neutral-900">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 border-t border-neutral-100 pt-3">
                <span>Total</span>
                <span className="text-xl text-neutral-900">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span>Secure Checkout with 256-Bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span>100% Safe & Secure Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
