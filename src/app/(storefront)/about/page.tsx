import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Heart, Sparkles, Award, Globe, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/60 px-4 py-1.5 text-xs font-extrabold text-amber-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Our Story</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 font-serif tracking-tight">
          About Nexora
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
          We believe in better products for a brighter everyday. Nexora delivers thoughtfully curated lifestyle essentials designed to elevate your home, work, and personal space.
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { metric: "50K+", label: "Happy Customers", icon: Users },
          { metric: "200+", label: "Premium Brands", icon: Award },
          { metric: "4.8/5", label: "Average Rating", icon: Star },
          { metric: "10+", label: "Countries Served", icon: Globe },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl border border-neutral-200/90 bg-white text-center space-y-2 shadow-xs hover:border-amber-400/60 transition-all"
            >
              <Icon className="h-6 w-6 text-amber-500 mx-auto" />
              <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif">{item.metric}</h3>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Mission & Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-neutral-900 font-serif">Our Mission & Values</h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Founded with a passion for functional minimalist design, Nexora bridges the gap between premium quality and everyday accessibility.
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-1">
              <h4 className="font-extrabold text-sm text-neutral-900">Quality-First Standard</h4>
              <p className="text-xs text-neutral-500">Every item undergoes rigorous testing and inspection before joining our catalog.</p>
            </div>
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-1">
              <h4 className="font-extrabold text-sm text-neutral-900">Customer Obsession</h4>
              <p className="text-xs text-neutral-500">24/7 dedicated customer care and a 30-day money-back guarantee.</p>
            </div>
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-1">
              <h4 className="font-extrabold text-sm text-neutral-900">Sustainable Curation</h4>
              <p className="text-xs text-neutral-500">Prioritizing eco-friendly packaging and ethical supplier practices.</p>
            </div>
          </div>
        </div>

        {/* Right Lifestyle Image */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80"
            alt="About Nexora"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
