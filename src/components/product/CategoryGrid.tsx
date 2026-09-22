import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface CategoryGridProps {
  categories?: Category[];
}

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" },
  { id: "2", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80" },
  { id: "3", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80" },
  { id: "4", name: "Beauty & Care", slug: "beauty-care", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80" },
  { id: "5", name: "Sports & Fitness", slug: "sports-fitness", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80" },
  { id: "6", name: "Travel", slug: "travel", image: "https://images.unsplash.com/photo-1553531384-cc94ac530133?w=400&auto=format&fit=crop&q=80" },
  { id: "7", name: "Pets", slug: "pets", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80" },
  { id: "8", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80" },
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  const displayCategories = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-12 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-serif">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Explore our top categories</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6 no-scrollbar">
          {displayCategories.map((cat) => {
            const imgSrc =
              cat.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80";

            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group flex-shrink-0 flex flex-col items-center text-center space-y-2.5 w-20 sm:w-auto"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-neutral-200/80 bg-neutral-100 shadow-xs group-hover:border-amber-500 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
