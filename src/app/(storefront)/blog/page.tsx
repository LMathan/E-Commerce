import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const POSTS = [
  {
    id: "1",
    title: "Minimal Living for a Better Life",
    excerpt: "Discover how decluttering your home space improves mental clarity and overall happiness.",
    date: "Apr 15, 2026",
    readTime: "5 min read",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "How to Choose the Right Headphones",
    excerpt: "A complete guide comparing noise cancellation, sound profiles, and battery performance.",
    date: "Apr 10, 2026",
    readTime: "4 min read",
    category: "Tech & Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Home Decor Ideas for 2026",
    excerpt: "Warm neutral palettes and organic textures taking over modern interior spaces.",
    date: "Apr 05, 2026",
    readTime: "6 min read",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    title: "Wellness Technology & Smart Fitness",
    excerpt: "How modern wearables track sleep, heart rate recovery, and stress levels.",
    date: "Mar 28, 2026",
    readTime: "4 min read",
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    title: "Sustainable Fashion Tips",
    excerpt: "Building a versatile capsule wardrobe with durable organic apparel.",
    date: "Mar 20, 2026",
    readTime: "5 min read",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    title: "Travel Light, Live More",
    excerpt: "Essential gear and packing strategies for effortless weekend getaways.",
    date: "Mar 12, 2026",
    readTime: "3 min read",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1553531384-cc94ac530133?w=600&auto=format&fit=crop&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif">Latest Stories</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Read our latest articles on lifestyle, wellness, tech, and minimalist interior trends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs hover:border-amber-400/80 hover:shadow-xl transition-all"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-900 shadow-xs">
                {post.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[11px] text-neutral-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-600 transition-colors font-serif leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-900 group-hover:text-amber-600 transition-colors">
                  <span>Read Story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
