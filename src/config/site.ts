/**
 * Site-wide configuration.
 * These are safe to import in client and server code.
 * Do NOT put secrets here.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "LuxeShop",
  description:
    "Premium dropshipping store with handpicked products curated for quality and style.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.jpg",

  // Business info
  business: {
    name: "LuxeShop",
    email: "support@luxeshop.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    country: "IN",
  },

  // Social links
  social: {
    twitter: "https://twitter.com/luxeshop",
    instagram: "https://instagram.com/luxeshop",
    facebook: "https://facebook.com/luxeshop",
  },

  // Currency
  defaultCurrency: (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "INR") as
    | "INR"
    | "USD"
    | "AED"
    | "EUR"
    | "GBP",

  // SEO defaults
  seo: {
    titleTemplate: "%s | LuxeShop",
    defaultTitle: "LuxeShop — Premium Products, Delivered",
    defaultDescription:
      "Shop premium products with fast delivery and easy returns. LuxeShop curates the best products for your lifestyle.",
  },

  // Pagination
  pagination: {
    productsPerPage: 24,
    ordersPerPage: 20,
    reviewsPerPage: 10,
    adminPageSize: 25,
  },

  // Features
  features: {
    guestCheckout: true,
    wishlist: true,
    reviews: true,
    blog: true,
    support: true,
    tracking: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
