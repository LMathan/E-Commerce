/**
 * Date formatting utilities.
 */

import { format, formatDistance, formatRelative, isValid } from "date-fns";

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "MMM d, yyyy");
}

/**
 * Format a date with time.
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "MMM d, yyyy, h:mm a");
}

/**
 * Format relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return formatDistance(d, new Date(), { addSuffix: true });
}

/**
 * Format for order numbers.
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Get current UTC ISO string for database.
 */
export function nowUTC(): Date {
  return new Date();
}
