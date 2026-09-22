/**
 * Zod validation schemas.
 * Used for server-side validation in API routes and server actions.
 * Never trust client-provided data — always validate on the server.
 */

import { z } from "zod";

// ----------------------------------------------------------------
// Auth Schemas
// ----------------------------------------------------------------

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ----------------------------------------------------------------
// Address Schema
// ----------------------------------------------------------------

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  company: z.string().max(200).optional(),
  addressLine1: z.string().min(5, "Address is required").max(500),
  addressLine2: z.string().max(500).optional(),
  city: z.string().min(1, "City is required").max(200),
  state: z.string().min(1, "State is required").max(200),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().length(2, "Invalid country code"),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
  label: z.string().max(50).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ----------------------------------------------------------------
// Product Schemas
// ----------------------------------------------------------------

const priceSchema = z.number().int().nonnegative("Price must be non-negative");

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, "SKU is required").max(100),
  barcode: z.string().max(200).optional(),
  options: z.record(z.string(), z.string()).default({}),
  price: priceSchema,
  compareAtPrice: priceSchema.optional().nullable(),
  costPrice: priceSchema.optional().nullable(),
  stock: z.number().int().nonnegative().default(0),
  lowStockAlert: z.number().int().nonnegative().default(5),
  weight: z.number().nonnegative().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "DELETED"]).default("ACTIVE"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(500),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  sku: z.string().max(100).optional().nullable(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  brand: z.string().max(200).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isOnSale: z.boolean().default(false),

  basePrice: priceSchema,
  compareAtPrice: priceSchema.optional().nullable(),
  costPrice: priceSchema.optional().nullable(),

  taxCategory: z.enum(["NONE", "STANDARD", "REDUCED", "ZERO"]).default("STANDARD"),
  shippingClass: z.enum(["STANDARD", "EXPRESS", "FREIGHT", "DIGITAL"]).default("STANDARD"),

  weight: z.number().nonnegative().optional().nullable(),
  lengthCm: z.number().nonnegative().optional().nullable(),
  widthCm: z.number().nonnegative().optional().nullable(),
  heightCm: z.number().nonnegative().optional().nullable(),

  seoTitle: z.string().max(160).optional(),
  seoDesc: z.string().max(320).optional(),
  seoKeywords: z.array(z.string()).default([]),

  categoryIds: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
});

export type ProductInput = z.infer<typeof productSchema>;

// ----------------------------------------------------------------
// Cart Schemas
// ----------------------------------------------------------------

export const addToCartSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  variantId: z.string().cuid("Invalid variant ID").optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().cuid("Invalid cart item ID"),
  quantity: z.number().int().min(0, "Quantity must be 0 or more").max(100),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(50).toUpperCase(),
});

// ----------------------------------------------------------------
// Checkout Schemas
// ----------------------------------------------------------------

export const checkoutContactSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number").max(20),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const checkoutSchema = z.object({
  contact: checkoutContactSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  shippingMethodId: z.string().min(1, "Shipping method is required"),
  couponCode: z.string().optional(),
  paymentGateway: z.enum(["razorpay", "stripe", "cod"]).default("razorpay"),
  termsAccepted: z.literal(true).check(
    (ctx) => { if (!ctx.value) ctx.issues.push({ code: "custom", message: "You must accept the terms and conditions", input: ctx.value }); }
  ),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ----------------------------------------------------------------
// Order Schemas
// ----------------------------------------------------------------

export const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum([
    "PENDING_PAYMENT", "PAID", "PROCESSING", "SUPPLIER_PENDING",
    "SUPPLIER_ORDERED", "SUPPLIER_CONFIRMED", "PREPARING_SHIPMENT",
    "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED",
    "CANCELLED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURNED",
    "REFUND_PENDING", "REFUNDED",
  ]),
  note: z.string().max(1000).optional(),
});

export const addTrackingSchema = z.object({
  orderId: z.string().cuid(),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  carrier: z.string().min(1, "Carrier is required"),
  trackingUrl: z.string().url("Invalid tracking URL").optional(),
  estimatedDelivery: z.string().optional(), // ISO date string
});

// ----------------------------------------------------------------
// Supplier Schemas
// ----------------------------------------------------------------

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  company: z.string().max(200).optional(),
  contactPerson: z.string().max(200).optional(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().max(30).optional(),
  website: z.string().url("Invalid URL").optional().nullable(),
  addressLine1: z.string().max(500).optional(),
  addressLine2: z.string().max(500).optional(),
  city: z.string().max(200).optional(),
  state: z.string().max(200).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  currency: z.enum(["INR", "USD", "AED", "EUR", "GBP"]).default("INR"),
  notes: z.string().max(5000).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
});

export const supplierOrderSchema = z.object({
  orderId: z.string().cuid(),
  supplierId: z.string().cuid(),
  supplierOrderId: z.string().max(200).optional(),
  totalCost: z.number().int().nonnegative(),
  shippingCost: z.number().int().nonnegative().default(0),
  notes: z.string().max(5000).optional(),
  trackingNumber: z.string().max(200).optional(),
  carrier: z.string().max(200).optional(),
  trackingUrl: z.string().url().optional(),
});

// ----------------------------------------------------------------
// Review Schema
// ----------------------------------------------------------------

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  orderId: z.string().cuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10, "Review must be at least 10 characters").max(5000),
});

// ----------------------------------------------------------------
// Coupon Schema
// ----------------------------------------------------------------

export const couponSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase().regex(/^[A-Z0-9_-]+$/, "Invalid coupon code format"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.number().int().positive(),
  minOrderAmount: z.number().int().nonnegative().optional().nullable(),
  maxDiscountAmount: z.number().int().positive().optional().nullable(),
  productIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  isFirstOrderOnly: z.boolean().default(false),
  usageLimit: z.number().int().positive().optional().nullable(),
  perCustomerLimit: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

// ----------------------------------------------------------------
// Support Ticket Schema
// ----------------------------------------------------------------

export const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject too short").max(200),
  category: z.enum(["ORDER", "PAYMENT", "PRODUCT", "SHIPPING", "RETURN", "ACCOUNT", "GENERAL"]),
  orderId: z.string().cuid().optional().nullable(),
  message: z.string().min(20, "Please provide more details").max(5000),
  guestEmail: z.string().email().optional().nullable(),
});

export const supportMessageSchema = z.object({
  ticketId: z.string().cuid(),
  body: z.string().min(1).max(5000),
});

// ----------------------------------------------------------------
// Pagination / Filter Schemas
// ----------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const productFilterSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(["relevance", "price_asc", "price_desc", "newest", "bestselling"]).default("relevance"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;
