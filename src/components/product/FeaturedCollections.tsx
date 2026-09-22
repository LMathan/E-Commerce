"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const COLLECTIONS = [
  {
    title: "Smart Home",
    subtitle: "Automate your living space",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
    href: "/shop?category=electronics",
  },
  {
    title: "Modern Fashion",
    subtitle: "Elevate your style statement",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    href: "/shop?category=fashion",
  },
  {
    title: "Fitness Gear",
    subtitle: "Train hard, stay healthy",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    href: "/shop?category=sports-fitness",
  },
  {
    title: "Travel Essentials",
    subtitle: "Ready for your next journey",
    image: "https://images.unsplash.com/photo-1553531384-cc94ac530133?w=600&auto=format&fit=crop&q=80",
    href: "/shop?category=travel",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-12 bg-neutral-50/50 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-serif">
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Explore curated lifestyle themes</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={col.href}
                className="group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900 p-6 min-h-[220px] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
                <div className="relative z-10 text-white space-y-1">
                  <h3 className="text-lg font-bold tracking-tight font-serif">{col.title}</h3>
                  <p className="text-xs text-neutral-300 font-normal">{col.subtitle}</p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-amber-400">
                    <span>Shop Collection</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
