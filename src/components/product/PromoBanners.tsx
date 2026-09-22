"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PromoBanners() {
  return (
    <section className="py-12 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Dark Theme Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl bg-neutral-950 p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-xl text-white"
          >
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 border border-amber-500/30">
                New Season
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight font-serif">
                New Season<br />New Possibilities
              </h3>
              <p className="text-amber-400 font-bold text-sm">Up to 50% OFF</p>
              <div className="pt-2">
                <Link
                  href="/shop?sale=true"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-white group-hover:text-amber-400 transition-colors border-b border-white/30 group-hover:border-amber-400 pb-0.5"
                >
                  <span>Shop the Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Product Image Overlay */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="New Season Headphones"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
            </div>
          </motion.div>

          {/* Right Warm Light Theme Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-amber-50/80 border border-amber-200/60 p-8 sm:p-10 flex flex-col justify-between min-h-[280px] shadow-sm text-neutral-900"
          >
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="inline-block rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-neutral-800 border border-neutral-200 shadow-sm">
                Curated Aesthetics
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight font-serif text-neutral-900">
                Minimal Designs<br />Maximum Impact
              </h3>
              <p className="text-neutral-600 text-xs">Transform your everyday living space with minimalist essentials.</p>
              <div className="pt-2">
                <Link
                  href="/shop?category=home-living"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-neutral-900 group-hover:text-amber-600 transition-colors border-b border-neutral-400 group-hover:border-amber-600 pb-0.5"
                >
                  <span>Explore Home Essentials</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Product Image Overlay */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none group-hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80"
                alt="Minimal Home Decor"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
