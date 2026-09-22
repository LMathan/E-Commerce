/**
 * Common shared types across the application.
 */

import type { Prisma } from "@prisma/client";

// ----------------------------------------------------------------
// API Types
// ----------------------------------------------------------------

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SortParams {
  field: string;
  direction: "asc" | "desc";
}

// ----------------------------------------------------------------
// Auth Types
// ----------------------------------------------------------------

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
}

// ----------------------------------------------------------------
// Product Types (UI-safe, no server-only fields)
// ----------------------------------------------------------------

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number | null;
  primaryImage?: string | null;
  rating?: number;
  reviewCount?: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  brand?: string | null;
}

export interface VariantOption {
  name: string;
  value: string;
}

// ----------------------------------------------------------------
// Cart Types
// ----------------------------------------------------------------

export interface CartItemDisplay {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantLabel?: string | null;
  image?: string | null;
  slug: string;
  price: number;
  quantity: number;
  stockAvailable: number;
  options?: Record<string, string>;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  couponCode?: string | null;
}

// ----------------------------------------------------------------
// Order Types (customer-facing, no supplier/internal info)
// ----------------------------------------------------------------

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  itemCount: number;
  createdAt: Date;
  primaryImage?: string | null;
}

export interface TrackingInfo {
  orderNumber: string;
  status: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  estimatedDelivery?: Date | null;
  events: Array<{
    status: string;
    description: string;
    location?: string | null;
    timestamp: Date;
  }>;
}

// ----------------------------------------------------------------
// Address Types
// ----------------------------------------------------------------

export interface AddressData {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// ----------------------------------------------------------------
// Search Types
// ----------------------------------------------------------------

export interface SearchFilters {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest" | "bestselling";
  page?: number;
  limit?: number;
}

// ----------------------------------------------------------------
// Analytics Types
// ----------------------------------------------------------------

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  totalRefunds: number;
  estimatedProfit: number;
  profitMargin: number;
}

// ----------------------------------------------------------------
// Realtime Types
// ----------------------------------------------------------------

export interface RealtimeOrderEvent {
  type: string;
  orderId: string;
  orderNumber: string;
  status: string;
  amount?: number;
  customerName?: string;
  timestamp: string;
}

export interface RealtimeInventoryEvent {
  type: string;
  productId: string;
  variantId: string;
  sku: string;
  previousStock: number;
  currentStock: number;
  timestamp: string;
}

// ----------------------------------------------------------------
// Notification Types
// ----------------------------------------------------------------

export interface NotificationPayload {
  userId?: string;
  orderId?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Prisma computed type helpers
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    categories: { include: { category: true } };
    tags: { include: { tag: true } };
    reviews: { where: { status: "APPROVED" }; select: { rating: true } };
  };
}>;
