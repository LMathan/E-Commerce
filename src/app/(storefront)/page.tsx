import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/product/HeroSection";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { PromoBanners } from "@/components/product/PromoBanners";
import { FeaturedCollections } from "@/components/product/FeaturedCollections";
import { TrustBenefits } from "@/components/layout/TrustBenefits";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: {
    canonical: siteConfig.url,
  },
};

export const revalidate = 60;

async function getHomepageData() {
  try {
    const [featuredProducts, categories, sections] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE", isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
      }),
      prisma.category.findMany({
        where: { isVisible: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      prisma.homepageSection.findMany({
        where: { isEnabled: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return { featuredProducts, categories, sections };
  } catch {
    return { featuredProducts: [], categories: [], sections: [] };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories, sections } = await getHomepageData();

  const heroSection = sections.find((s) => s.type === "HERO");
  const heroContent = heroSection?.content as {
    ctaText?: string;
    ctaLink?: string;
  } | null;

  const products = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: p.basePrice,
    compareAtPrice: p.compareAtPrice,
    primaryImage: p.images[0]?.url ?? null,
    avgRating:
      p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 4.8,
    totalReviews: p.reviews.length || 12,
    isOnSale: p.isOnSale,
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
    isNewArrival: p.isNewArrival,
    brand: p.brand,
  }));

  // Fallback demo products if DB is empty
  const demoProducts = products.length > 0 ? products : [
    {
      id: "p1",
      name: "SoundPro X1 Wireless Earbuds",
      slug: "soundpro-x1-wireless-earbuds",
      basePrice: 49.99,
      compareAtPrice: 60.00,
      primaryImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      avgRating: 4.8,
      totalReviews: 2400,
      isOnSale: true,
      isFeatured: true,
      isBestseller: true,
      brand: "SoundPro",
    },
    {
      id: "p2",
      name: "Modern LED Table Lamp",
      slug: "modern-led-table-lamp",
      basePrice: 34.99,
      compareAtPrice: 45.00,
      primaryImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      avgRating: 4.7,
      totalReviews: 1900,
      isOnSale: true,
      isFeatured: true,
      isBestseller: true,
      brand: "LumiHome",
    },
    {
      id: "p3",
      name: "NexFit Smartwatch Series 5",
      slug: "nexfit-smartwatch-series-5",
      basePrice: 79.99,
      compareAtPrice: 99.99,
      primaryImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      avgRating: 4.9,
      totalReviews: 3200,
      isOnSale: true,
      isFeatured: true,
      isBestseller: true,
      brand: "NexFit",
    },
    {
      id: "p4",
      name: "UrbanFlex Running Shoes",
      slug: "urbanflex-running-shoes",
      basePrice: 59.99,
      compareAtPrice: 79.99,
      primaryImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      avgRating: 4.6,
      totalReviews: 1100,
      isOnSale: true,
      isFeatured: true,
      isBestseller: false,
      brand: "UrbanFlex",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={heroSection?.title ?? "Everyday Essentials For a Better Life"}
        subtitle={heroSection?.subtitle ?? "Thoughtfully curated products for your home, work and everything in between."}
        ctaText={heroContent?.ctaText ?? "Shop Now"}
        ctaLink={heroContent?.ctaLink ?? "/shop"}
      />

      {/* Trust Benefits Bar */}
      <TrustBenefits />

      {/* Shop by Category */}
      <CategoryGrid categories={categories} />

      {/* Trending Now */}
      <FeaturedProducts
        title="Trending Now"
        subtitle="Most loved products by our customers"
        products={demoProducts}
        viewAllHref="/shop"
      />

      {/* Dual Promotional Banners */}
      <PromoBanners />

      {/* Featured Collections */}
      <FeaturedCollections />
    </>
  );
}
