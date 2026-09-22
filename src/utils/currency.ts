/**
 * Currency utility functions.
 * All monetary values in the database are stored as integers (minor units).
 * E.g., ₹1,499.00 is stored as 149900 (paise).
 *
 * NEVER use floating-point arithmetic for money.
 */

import { CURRENCY_CONFIG } from "@/config/constants";

export type CurrencyCode = keyof typeof CURRENCY_CONFIG;

/**
 * Format minor units to a human-readable currency string.
 * E.g., formatCurrency(149900, "INR") → "₹1,499.00"
 */
export function formatCurrency(
  minorUnits: number,
  currency: CurrencyCode = "INR"
): string {
  const config = CURRENCY_CONFIG[currency];
  const majorUnits = minorUnits / 100;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(majorUnits);
}

/**
 * Convert major units (user-entered price) to minor units for DB storage.
 * E.g., toMinorUnits(1499.00) → 149900
 */
export function toMinorUnits(majorUnits: number): number {
  return Math.round(majorUnits * 100);
}

/**
 * Convert minor units to major units for display/calculation.
 * E.g., toMajorUnits(149900) → 1499.00
 */
export function toMajorUnits(minorUnits: number): number {
  return minorUnits / 100;
}

/**
 * Calculate percentage discount.
 * @returns discount amount in minor units
 */
export function calculatePercentageDiscount(
  amount: number,
  percentage: number
): number {
  return Math.round((amount * percentage) / 100);
}

/**
 * Apply coupon discount to an amount.
 * Returns the discounted amount in minor units.
 */
export function applyCouponDiscount(
  subtotal: number,
  couponType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
  couponValue: number,
  maxDiscount?: number | null
): number {
  let discount = 0;

  if (couponType === "PERCENTAGE") {
    discount = calculatePercentageDiscount(subtotal, couponValue);
  } else if (couponType === "FIXED_AMOUNT") {
    discount = couponValue;
  }

  // Cap at max discount if configured
  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount;
  }

  // Discount cannot exceed subtotal
  return Math.min(discount, subtotal);
}

/**
 * Calculate tax amount.
 */
export function calculateTax(
  amount: number,
  taxRate: number // e.g., 0.18 for 18%
): number {
  return Math.round(amount * taxRate);
}

/**
 * Calculate estimated profit.
 */
export function calculateProfit({
  sellingPrice,
  supplierCost,
  supplierShipping,
  paymentFee,
  otherCosts = 0,
  refunds = 0,
}: {
  sellingPrice: number;
  supplierCost: number;
  supplierShipping: number;
  paymentFee: number;
  otherCosts?: number;
  refunds?: number;
}): {
  profit: number;
  profitMargin: number;
} {
  const totalCosts = supplierCost + supplierShipping + paymentFee + otherCosts + refunds;
  const profit = sellingPrice - totalCosts;
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return {
    profit,
    profitMargin: Math.round(profitMargin * 100) / 100,
  };
}

/**
 * Calculate Razorpay fee (2% + GST @ 18% on fee = ~2.36% effective).
 */
export function calculateRazorpayFee(amount: number): number {
  const fee = Math.round(amount * 0.02);
  const gstOnFee = Math.round(fee * 0.18);
  return fee + gstOnFee;
}

/**
 * Calculate Stripe fee (2.9% + ₹30).
 */
export function calculateStripeFee(amount: number): number {
  return Math.round(amount * 0.029) + 3000; // ₹30 in paise
}
