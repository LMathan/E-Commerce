import slugifyFn from "slugify";
export { formatCurrency } from "./currency";

/**
 * Generate a URL-safe slug from a string.
 */
export function generateSlug(input: string): string {
  return slugifyFn(input, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Ensure slug is unique by appending a suffix.
 * Pass existing slugs to check against.
 */
export function ensureUniqueSlug(
  base: string,
  existingSlugs: string[]
): string {
  const slug = generateSlug(base);

  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let suffix = 1;
  while (existingSlugs.includes(`${slug}-${suffix}`)) {
    suffix++;
  }
  return `${slug}-${suffix}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Convert object to URL query string.
 */
export function toQueryString(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Parse integer from string safely.
 */
export function safeParseInt(value: unknown, fallback: number = 0): number {
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parse float from string safely.
 */
export function safeParseFloat(value: unknown, fallback: number = 0): number {
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Check if a value is a valid positive integer.
 */
export function isPositiveInt(value: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Remove undefined/null keys from an object.
 */
export function cleanObject<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}
