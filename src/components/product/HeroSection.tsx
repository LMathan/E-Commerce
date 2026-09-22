"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = "Everyday Essentials For a Better Life",
  subtitle = "Thoughtfully curated products for your home, work and everything in between.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-white py-10 lg:py-16 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Wording & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/60 px-4 py-1.5 text-xs font-extrabold tracking-tight text-amber-900 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Better Products. A Brighter You.</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 leading-[1.08] tracking-tight font-serif"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed font-normal"
            >
              {subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2.5 rounded-full bg-amber-500 px-8 py-3.5 text-sm sm:text-base font-extrabold text-neutral-950 shadow-xl shadow-amber-500/25 hover:bg-amber-600 transition-all hover:scale-105 active:scale-95"
              >
                <span>{ctaText}</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </Link>

              <Link
                href="/shop?featured=true"
                className="inline-flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-sm sm:text-base font-bold text-neutral-800 shadow-sm hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95"
              >
                <div className="h-6 w-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <Play className="h-3 w-3 fill-neutral-800 ml-0.5" />
                </div>
                <span>Watch Video</span>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-5 flex items-center space-x-4 border-t border-neutral-200/80"
            >
              <div className="flex -space-x-2.5 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">50K+ Happy Customers</p>
                <div className="flex items-center text-amber-500 space-x-0.5 text-xs font-bold mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-neutral-900 ml-1">4.8/5</span>
                  <span className="text-neutral-400 font-normal">(12.4K reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Banner Image with Quote & Carousel Controls */}
          <div className="lg:col-span-6 relative">
            {/* Carousel Navigation Buttons */}
            <button className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100"
            >
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80"
                alt="Everyday Essentials For a Better Life"
                fill
                className="object-cover"
                priority
              />

              {/* Handwritten Quote Card Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3.5 px-4 rounded-2xl shadow-xl border border-white/50 max-w-[150px] text-center transform rotate-3">
                <p className="font-serif italic text-xs text-neutral-900 font-bold leading-snug">
                  Good Things Take Time ♡
                </p>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-1.5">
                <span className="h-2 w-6 rounded-full bg-amber-500" />
                <span className="h-2 w-2 rounded-full bg-white/70" />
                <span className="h-2 w-2 rounded-full bg-white/70" />
                <span className="h-2 w-2 rounded-full bg-white/70" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
