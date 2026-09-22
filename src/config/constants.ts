/**
 * Application-wide constants.
 * Do NOT put secrets here.
 */

// Order status display
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Payment Confirmed",
  PROCESSING: "Processing",
  SUPPLIER_PENDING: "Pending Supplier",
  SUPPLIER_ORDERED: "Ordered from Supplier",
  SUPPLIER_CONFIRMED: "Supplier Confirmed",
  PREPARING_SHIPMENT: "Preparing Shipment",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURN_APPROVED: "Return Approved",
  RETURNED: "Returned",
  REFUND_PENDING: "Refund Pending",
  REFUNDED: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "yellow",
  PAID: "blue",
  PROCESSING: "blue",
  SUPPLIER_PENDING: "orange",
  SUPPLIER_ORDERED: "orange",
  SUPPLIER_CONFIRMED: "orange",
  PREPARING_SHIPMENT: "indigo",
  SHIPPED: "indigo",
  IN_TRANSIT: "indigo",
  OUT_FOR_DELIVERY: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
  RETURN_REQUESTED: "orange",
  RETURN_APPROVED: "orange",
  RETURNED: "gray",
  REFUND_PENDING: "yellow",
  REFUNDED: "gray",
};

// Customer-visible order statuses (hide internal supplier states)
export const CUSTOMER_ORDER_TIMELINE = [
  { status: "PENDING_PAYMENT", label: "Order Placed", icon: "ShoppingCart" },
  { status: "PAID", label: "Payment Confirmed", icon: "CheckCircle" },
  { status: "PROCESSING", label: "Processing", icon: "Settings" },
  { status: "SHIPPED", label: "Shipped", icon: "Package" },
  { status: "IN_TRANSIT", label: "In Transit", icon: "Truck" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "MapPin" },
  { status: "DELIVERED", label: "Delivered", icon: "Home" },
];

// Currency config
export const CURRENCY_CONFIG = {
  INR: { symbol: "₹", code: "INR", locale: "en-IN", decimals: 2 },
  USD: { symbol: "$", code: "USD", locale: "en-US", decimals: 2 },
  AED: { symbol: "د.إ", code: "AED", locale: "ar-AE", decimals: 2 },
  EUR: { symbol: "€", code: "EUR", locale: "en-EU", decimals: 2 },
  GBP: { symbol: "£", code: "GBP", locale: "en-GB", decimals: 2 },
} as const;

// Payment gateways
export const PAYMENT_GATEWAYS = {
  RAZORPAY: "razorpay",
  STRIPE: "stripe",
  COD: "cod",
} as const;

// Tax rates (in decimal — 0.18 = 18%)
export const TAX_RATES = {
  NONE: 0,
  STANDARD: 0.18,  // 18% GST
  REDUCED: 0.05,   // 5% GST
  ZERO: 0,
} as const;

// Low stock threshold default
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

// Session settings
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

// Rate limiting
export const RATE_LIMITS = {
  auth: { requests: 10, window: 60 * 1000 },       // 10 per minute
  api: { requests: 100, window: 60 * 1000 },        // 100 per minute
  checkout: { requests: 5, window: 60 * 1000 },     // 5 per minute
  webhook: { requests: 1000, window: 60 * 1000 },   // 1000 per minute
} as const;

// File upload limits
export const UPLOAD_CONFIG = {
  maxImageSize: 4 * 1024 * 1024,  // 4MB
  maxVideoSize: 64 * 1024 * 1024, // 64MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  allowedVideoTypes: ["video/mp4", "video/webm"],
  maxImagesPerProduct: 10,
} as const;

// Realtime channels
export const REALTIME_CHANNELS = {
  ADMIN_DASHBOARD: "admin-dashboard",
  ORDER_PREFIX: "order-",
  INVENTORY: "inventory",
} as const;

// Realtime event types
export const REALTIME_EVENTS = {
  NEW_ORDER: "NEW_ORDER",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
  SUPPLIER_ORDER_CREATED: "SUPPLIER_ORDER_CREATED",
  SUPPLIER_ORDER_UPDATED: "SUPPLIER_ORDER_UPDATED",
  SHIPMENT_UPDATED: "SHIPMENT_UPDATED",
  TRACKING_UPDATED: "TRACKING_UPDATED",
  INVENTORY_UPDATED: "INVENTORY_UPDATED",
  NEW_CUSTOMER: "NEW_CUSTOMER",
  NEW_REVIEW: "NEW_REVIEW",
  REFUND_REQUESTED: "REFUND_REQUESTED",
} as const;

export type RealtimeEvent = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];
