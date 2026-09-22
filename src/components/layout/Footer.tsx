"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export function Footer() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    addToast({ type: "success", title: "Subscribed to newsletter!" });
    setEmail("");
  };

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200/80 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200/80">
          {/* Brand Info & Newsletter Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-neutral-950 font-black shadow-xs">
                <Sparkles className="h-4 w-4 fill-neutral-950 text-amber-500" />
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral-900 font-serif">
                Nexora<span className="text-amber-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Thoughtfully curated products for your home, work and everything in between. Delivering quality lifestyle essentials with express shipping.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold text-neutral-900 mb-2">Join Our Newsletter</p>
              <p className="text-[11px] text-neutral-500 mb-3">Get the latest updates, new arrivals and exclusive offers.</p>
              
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <Check className="h-4 w-4" />
                  <span>Thanks for subscribing! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center max-w-sm relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-full border border-neutral-200 bg-neutral-100/80 py-2.5 pl-4 pr-12 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 h-7 w-7 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-amber-500 hover:text-neutral-950 transition-colors"
                    aria-label="Submit newsletter"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Nav Links Column 1: Shop */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Shop</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li><Link href="/shop" className="hover:text-amber-600 transition-colors">All Products</Link></li>
              <li><Link href="/shop?new=true" className="hover:text-amber-600 transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?bestseller=true" className="hover:text-amber-600 transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop?sale=true" className="hover:text-amber-600 transition-colors">Deals & Sales</Link></li>
            </ul>
          </div>

          {/* Nav Links Column 2: Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Customer Care</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li><Link href="/account/orders" className="hover:text-amber-600 transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-amber-600 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-amber-600 transition-colors">Shipping Info</Link></li>
              <li><Link href="/contact" className="hover:text-amber-600 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Nav Links Column 3: About Us */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">About Us</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li><Link href="/about" className="hover:text-amber-600 transition-colors">Our Story</Link></li>
              <li><Link href="/about" className="hover:text-amber-600 transition-colors">Careers</Link></li>
              <li><Link href="/about" className="hover:text-amber-600 transition-colors">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-amber-600 transition-colors">Press & Media</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Nexora, Inc. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-neutral-900 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
