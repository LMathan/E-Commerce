/**
 * Role-Based Access Control (RBAC) utilities.
 *
 * Permission checks happen SERVER-SIDE only.
 * Never expose permission data to client components unnecessarily.
 */

import type { SessionUser } from "@/types/common";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export type RoleName =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "ORDER_MANAGER"
  | "SUPPORT_AGENT"
  | "CONTENT_MANAGER"
  | "FINANCE_MANAGER"
  | "CUSTOMER";

export type PermissionName =
  | "PRODUCT_READ"
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "PRODUCT_PUBLISH"
  | "CATEGORY_READ"
  | "CATEGORY_CREATE"
  | "CATEGORY_UPDATE"
  | "CATEGORY_DELETE"
  | "COLLECTION_READ"
  | "COLLECTION_CREATE"
  | "COLLECTION_UPDATE"
  | "COLLECTION_DELETE"
  | "ORDER_READ"
  | "ORDER_UPDATE"
  | "ORDER_CANCEL"
  | "ORDER_REFUND"
  | "CUSTOMER_READ"
  | "CUSTOMER_UPDATE"
  | "CUSTOMER_DELETE"
  | "SUPPLIER_READ"
  | "SUPPLIER_CREATE"
  | "SUPPLIER_UPDATE"
  | "SUPPLIER_DELETE"
  | "SUPPLIER_ORDER_READ"
  | "SUPPLIER_ORDER_CREATE"
  | "SUPPLIER_ORDER_UPDATE"
  | "INVENTORY_READ"
  | "INVENTORY_UPDATE"
  | "PAYMENT_READ"
  | "PAYMENT_REFUND"
  | "COUPON_READ"
  | "COUPON_CREATE"
  | "COUPON_UPDATE"
  | "COUPON_DELETE"
  | "SHIPPING_READ"
  | "SHIPPING_UPDATE"
  | "REVIEW_READ"
  | "REVIEW_MODERATE"
  | "CONTENT_READ"
  | "CONTENT_UPDATE"
  | "BLOG_READ"
  | "BLOG_CREATE"
  | "BLOG_UPDATE"
  | "BLOG_DELETE"
  | "BLOG_PUBLISH"
  | "SUPPORT_READ"
  | "SUPPORT_REPLY"
  | "SUPPORT_ASSIGN"
  | "SUPPORT_CLOSE"
  | "ANALYTICS_READ"
  | "SETTINGS_READ"
  | "SETTINGS_UPDATE"
  | "MEDIA_READ"
  | "MEDIA_UPLOAD"
  | "MEDIA_DELETE"
  | "AUDIT_READ"
  | "USER_READ"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DELETE"
  | "USER_ASSIGN_ROLE";

/**
 * Default role-to-permission mappings.
 * Used when seeding the database.
 */
export const ROLE_PERMISSIONS: Record<RoleName, PermissionName[]> = {
  SUPER_ADMIN: [
    "PRODUCT_READ", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_DELETE", "PRODUCT_PUBLISH",
    "CATEGORY_READ", "CATEGORY_CREATE", "CATEGORY_UPDATE", "CATEGORY_DELETE",
    "COLLECTION_READ", "COLLECTION_CREATE", "COLLECTION_UPDATE", "COLLECTION_DELETE",
    "ORDER_READ", "ORDER_UPDATE", "ORDER_CANCEL", "ORDER_REFUND",
    "CUSTOMER_READ", "CUSTOMER_UPDATE", "CUSTOMER_DELETE",
    "SUPPLIER_READ", "SUPPLIER_CREATE", "SUPPLIER_UPDATE", "SUPPLIER_DELETE",
    "SUPPLIER_ORDER_READ", "SUPPLIER_ORDER_CREATE", "SUPPLIER_ORDER_UPDATE",
    "INVENTORY_READ", "INVENTORY_UPDATE",
    "PAYMENT_READ", "PAYMENT_REFUND",
    "COUPON_READ", "COUPON_CREATE", "COUPON_UPDATE", "COUPON_DELETE",
    "SHIPPING_READ", "SHIPPING_UPDATE",
    "REVIEW_READ", "REVIEW_MODERATE",
    "CONTENT_READ", "CONTENT_UPDATE",
    "BLOG_READ", "BLOG_CREATE", "BLOG_UPDATE", "BLOG_DELETE", "BLOG_PUBLISH",
    "SUPPORT_READ", "SUPPORT_REPLY", "SUPPORT_ASSIGN", "SUPPORT_CLOSE",
    "ANALYTICS_READ",
    "SETTINGS_READ", "SETTINGS_UPDATE",
    "MEDIA_READ", "MEDIA_UPLOAD", "MEDIA_DELETE",
    "AUDIT_READ",
    "USER_READ", "USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_ASSIGN_ROLE",
  ],
  ADMIN: [
    "PRODUCT_READ", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_DELETE", "PRODUCT_PUBLISH",
    "CATEGORY_READ", "CATEGORY_CREATE", "CATEGORY_UPDATE", "CATEGORY_DELETE",
    "COLLECTION_READ", "COLLECTION_CREATE", "COLLECTION_UPDATE", "COLLECTION_DELETE",
    "ORDER_READ", "ORDER_UPDATE", "ORDER_CANCEL", "ORDER_REFUND",
    "CUSTOMER_READ", "CUSTOMER_UPDATE",
    "SUPPLIER_READ", "SUPPLIER_CREATE", "SUPPLIER_UPDATE",
    "SUPPLIER_ORDER_READ", "SUPPLIER_ORDER_CREATE", "SUPPLIER_ORDER_UPDATE",
    "INVENTORY_READ", "INVENTORY_UPDATE",
    "PAYMENT_READ", "PAYMENT_REFUND",
    "COUPON_READ", "COUPON_CREATE", "COUPON_UPDATE", "COUPON_DELETE",
    "SHIPPING_READ", "SHIPPING_UPDATE",
    "REVIEW_READ", "REVIEW_MODERATE",
    "CONTENT_READ", "CONTENT_UPDATE",
    "BLOG_READ", "BLOG_CREATE", "BLOG_UPDATE", "BLOG_DELETE", "BLOG_PUBLISH",
    "SUPPORT_READ", "SUPPORT_REPLY", "SUPPORT_ASSIGN", "SUPPORT_CLOSE",
    "ANALYTICS_READ",
    "SETTINGS_READ",
    "MEDIA_READ", "MEDIA_UPLOAD", "MEDIA_DELETE",
    "AUDIT_READ",
    "USER_READ",
  ],
  PRODUCT_MANAGER: [
    "PRODUCT_READ", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_PUBLISH",
    "CATEGORY_READ", "CATEGORY_CREATE", "CATEGORY_UPDATE",
    "COLLECTION_READ", "COLLECTION_CREATE", "COLLECTION_UPDATE",
    "INVENTORY_READ", "INVENTORY_UPDATE",
    "MEDIA_READ", "MEDIA_UPLOAD",
    "REVIEW_READ",
  ],
  ORDER_MANAGER: [
    "ORDER_READ", "ORDER_UPDATE", "ORDER_CANCEL",
    "CUSTOMER_READ",
    "SUPPLIER_ORDER_READ", "SUPPLIER_ORDER_CREATE", "SUPPLIER_ORDER_UPDATE",
    "INVENTORY_READ",
    "SHIPPING_READ",
    "PAYMENT_READ",
  ],
  SUPPORT_AGENT: [
    "ORDER_READ",
    "CUSTOMER_READ",
    "SUPPORT_READ", "SUPPORT_REPLY", "SUPPORT_CLOSE",
    "REVIEW_READ",
    "PAYMENT_READ",
  ],
  CONTENT_MANAGER: [
    "PRODUCT_READ",
    "CATEGORY_READ",
    "COLLECTION_READ",
    "CONTENT_READ", "CONTENT_UPDATE",
    "BLOG_READ", "BLOG_CREATE", "BLOG_UPDATE", "BLOG_PUBLISH",
    "MEDIA_READ", "MEDIA_UPLOAD",
  ],
  FINANCE_MANAGER: [
    "ORDER_READ",
    "PAYMENT_READ", "PAYMENT_REFUND",
    "ANALYTICS_READ",
    "CUSTOMER_READ",
    "COUPON_READ",
  ],
  CUSTOMER: [], // Customers have no admin permissions
};

/**
 * Check if a user has a specific permission.
 */
export function hasPermission(
  user: SessionUser | null | undefined,
  permission: PermissionName
): boolean {
  if (!user) return false;
  if (user.roles.includes("SUPER_ADMIN")) return true;
  return user.permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions.
 */
export function hasAnyPermission(
  user: SessionUser | null | undefined,
  permissions: PermissionName[]
): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

/**
 * Check if a user has all of the specified permissions.
 */
export function hasAllPermissions(
  user: SessionUser | null | undefined,
  permissions: PermissionName[]
): boolean {
  return permissions.every((p) => hasPermission(user, p));
}

/**
 * Check if user has a specific role.
 */
export function hasRole(
  user: SessionUser | null | undefined,
  role: RoleName
): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Assert user is authenticated. Throws AuthenticationError if not.
 */
export function requireAuth(user: SessionUser | null | undefined): SessionUser {
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
}

/**
 * Assert user has a specific permission. Throws AuthorizationError if not.
 */
export function requirePermission(
  user: SessionUser | null | undefined,
  permission: PermissionName
): SessionUser {
  const authed = requireAuth(user);
  if (!hasPermission(authed, permission)) {
    throw new AuthorizationError(
      `Permission required: ${permission}`
    );
  }
  return authed;
}

/**
 * Assert user is an admin (has isAdmin flag or admin role).
 */
export function requireAdmin(user: SessionUser | null | undefined): SessionUser {
  const authed = requireAuth(user);
  if (
    !authed.isAdmin &&
    !authed.roles.some((r) =>
      ["SUPER_ADMIN", "ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "SUPPORT_AGENT", "CONTENT_MANAGER", "FINANCE_MANAGER"].includes(r)
    )
  ) {
    throw new AuthorizationError("Admin access required");
  }
  return authed;
}
