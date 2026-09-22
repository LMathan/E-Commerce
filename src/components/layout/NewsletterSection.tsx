"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export function NewsletterSection() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribed(true);
    addToast({ type: "success", title: "Subscribed! Check your inbox for 10% off." });
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/60 border-b border-neutral-200/80 relative overflow-hidden">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-amber-200/80 bg-white/90 p-8 sm:p-12 shadow-xl backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 block">
            Exclusive Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif">
            Join the LuxeShop Club
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
            Subscribe to get 10% off your first order, plus early access to new arrivals and private sales.
          </p>

          {subscribed ? (
            <div className="mt-8 flex items-center justify-center space-x-2 text-green-600 font-bold">
              <CheckCircle2 className="h-5 w-5" />
              <span>You're subscribed! Welcome to LuxeShop.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-sm font-extrabold text-neutral-950 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20 whitespace-nowrap"
              >
                <span>Subscribe</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="mt-4 text-[11px] text-neutral-500">
            No spam. Unsubscribe anytime with 1 click.
          </p>
        </div>
      </div>
    </section>
  );
}
