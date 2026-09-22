/**
 * Database seed — Development only.
 *
 * Creates:
 * - Roles and permissions
 * - Super admin user
 * - Site settings
 * - Sample categories, products (dev only)
 *
 * Run: npx tsx prisma/seed/dev.ts
 *
 * WARNING: This contains development data.
 * DO NOT run in production.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ROLE_PERMISSIONS } from "../../src/lib/auth/rbac";

const prisma = new PrismaClient();

const ROLES = [
  { name: "SUPER_ADMIN" as const, displayName: "Super Administrator", description: "Full system access" },
  { name: "ADMIN" as const, displayName: "Administrator", description: "Store administrator" },
  { name: "PRODUCT_MANAGER" as const, displayName: "Product Manager", description: "Manages products and inventory" },
  { name: "ORDER_MANAGER" as const, displayName: "Order Manager", description: "Manages orders and fulfillment" },
  { name: "SUPPORT_AGENT" as const, displayName: "Support Agent", description: "Handles customer support" },
  { name: "CONTENT_MANAGER" as const, displayName: "Content Manager", description: "Manages content and blog" },
  { name: "FINANCE_MANAGER" as const, displayName: "Finance Manager", description: "Manages payments and analytics" },
  { name: "CUSTOMER" as const, displayName: "Customer", description: "Registered customer" },
];

// All permissions in the system
const ALL_PERMISSIONS = [
  { name: "PRODUCT_READ" as const, displayName: "View Products", category: "Products" },
  { name: "PRODUCT_CREATE" as const, displayName: "Create Products", category: "Products" },
  { name: "PRODUCT_UPDATE" as const, displayName: "Edit Products", category: "Products" },
  { name: "PRODUCT_DELETE" as const, displayName: "Delete Products", category: "Products" },
  { name: "PRODUCT_PUBLISH" as const, displayName: "Publish Products", category: "Products" },
  { name: "CATEGORY_READ" as const, displayName: "View Categories", category: "Categories" },
  { name: "CATEGORY_CREATE" as const, displayName: "Create Categories", category: "Categories" },
  { name: "CATEGORY_UPDATE" as const, displayName: "Edit Categories", category: "Categories" },
  { name: "CATEGORY_DELETE" as const, displayName: "Delete Categories", category: "Categories" },
  { name: "COLLECTION_READ" as const, displayName: "View Collections", category: "Collections" },
  { name: "COLLECTION_CREATE" as const, displayName: "Create Collections", category: "Collections" },
  { name: "COLLECTION_UPDATE" as const, displayName: "Edit Collections", category: "Collections" },
  { name: "COLLECTION_DELETE" as const, displayName: "Delete Collections", category: "Collections" },
  { name: "ORDER_READ" as const, displayName: "View Orders", category: "Orders" },
  { name: "ORDER_UPDATE" as const, displayName: "Update Orders", category: "Orders" },
  { name: "ORDER_CANCEL" as const, displayName: "Cancel Orders", category: "Orders" },
  { name: "ORDER_REFUND" as const, displayName: "Refund Orders", category: "Orders" },
  { name: "CUSTOMER_READ" as const, displayName: "View Customers", category: "Customers" },
  { name: "CUSTOMER_UPDATE" as const, displayName: "Edit Customers", category: "Customers" },
  { name: "CUSTOMER_DELETE" as const, displayName: "Delete Customers", category: "Customers" },
  { name: "SUPPLIER_READ" as const, displayName: "View Suppliers", category: "Suppliers" },
  { name: "SUPPLIER_CREATE" as const, displayName: "Create Suppliers", category: "Suppliers" },
  { name: "SUPPLIER_UPDATE" as const, displayName: "Edit Suppliers", category: "Suppliers" },
  { name: "SUPPLIER_DELETE" as const, displayName: "Delete Suppliers", category: "Suppliers" },
  { name: "SUPPLIER_ORDER_READ" as const, displayName: "View Supplier Orders", category: "Suppliers" },
  { name: "SUPPLIER_ORDER_CREATE" as const, displayName: "Create Supplier Orders", category: "Suppliers" },
  { name: "SUPPLIER_ORDER_UPDATE" as const, displayName: "Update Supplier Orders", category: "Suppliers" },
  { name: "INVENTORY_READ" as const, displayName: "View Inventory", category: "Inventory" },
  { name: "INVENTORY_UPDATE" as const, displayName: "Update Inventory", category: "Inventory" },
  { name: "PAYMENT_READ" as const, displayName: "View Payments", category: "Payments" },
  { name: "PAYMENT_REFUND" as const, displayName: "Process Refunds", category: "Payments" },
  { name: "COUPON_READ" as const, displayName: "View Coupons", category: "Coupons" },
  { name: "COUPON_CREATE" as const, displayName: "Create Coupons", category: "Coupons" },
  { name: "COUPON_UPDATE" as const, displayName: "Edit Coupons", category: "Coupons" },
  { name: "COUPON_DELETE" as const, displayName: "Delete Coupons", category: "Coupons" },
  { name: "SHIPPING_READ" as const, displayName: "View Shipping", category: "Shipping" },
  { name: "SHIPPING_UPDATE" as const, displayName: "Update Shipping", category: "Shipping" },
  { name: "REVIEW_READ" as const, displayName: "View Reviews", category: "Reviews" },
  { name: "REVIEW_MODERATE" as const, displayName: "Moderate Reviews", category: "Reviews" },
  { name: "CONTENT_READ" as const, displayName: "View Content", category: "Content" },
  { name: "CONTENT_UPDATE" as const, displayName: "Edit Content", category: "Content" },
  { name: "BLOG_READ" as const, displayName: "View Blog", category: "Blog" },
  { name: "BLOG_CREATE" as const, displayName: "Create Blog Posts", category: "Blog" },
  { name: "BLOG_UPDATE" as const, displayName: "Edit Blog Posts", category: "Blog" },
  { name: "BLOG_DELETE" as const, displayName: "Delete Blog Posts", category: "Blog" },
  { name: "BLOG_PUBLISH" as const, displayName: "Publish Blog Posts", category: "Blog" },
  { name: "SUPPORT_READ" as const, displayName: "View Support Tickets", category: "Support" },
  { name: "SUPPORT_REPLY" as const, displayName: "Reply to Tickets", category: "Support" },
  { name: "SUPPORT_ASSIGN" as const, displayName: "Assign Tickets", category: "Support" },
  { name: "SUPPORT_CLOSE" as const, displayName: "Close Tickets", category: "Support" },
  { name: "ANALYTICS_READ" as const, displayName: "View Analytics", category: "Analytics" },
  { name: "SETTINGS_READ" as const, displayName: "View Settings", category: "Settings" },
  { name: "SETTINGS_UPDATE" as const, displayName: "Update Settings", category: "Settings" },
  { name: "MEDIA_READ" as const, displayName: "View Media", category: "Media" },
  { name: "MEDIA_UPLOAD" as const, displayName: "Upload Media", category: "Media" },
  { name: "MEDIA_DELETE" as const, displayName: "Delete Media", category: "Media" },
  { name: "AUDIT_READ" as const, displayName: "View Audit Logs", category: "System" },
  { name: "USER_READ" as const, displayName: "View Users", category: "Users" },
  { name: "USER_CREATE" as const, displayName: "Create Users", category: "Users" },
  { name: "USER_UPDATE" as const, displayName: "Edit Users", category: "Users" },
  { name: "USER_DELETE" as const, displayName: "Delete Users", category: "Users" },
  { name: "USER_ASSIGN_ROLE" as const, displayName: "Assign Roles", category: "Users" },
];

const DEFAULT_SETTINGS = [
  { key: "store_name", value: "LuxeShop", type: "string", group: "general" },
  { key: "store_email", value: "store@luxeshop.com", type: "string", group: "general" },
  { key: "store_phone", value: "+91 98765 43210", type: "string", group: "general" },
  { key: "default_currency", value: "INR", type: "string", group: "general" },
  { key: "tax_enabled", value: "true", type: "boolean", group: "general" },
  { key: "default_tax_rate", value: "18", type: "number", group: "general" },
  { key: "free_shipping_threshold", value: "99900", type: "number", group: "shipping" },
  { key: "low_stock_threshold", value: "5", type: "number", group: "inventory" },
  { key: "review_moderation", value: "true", type: "boolean", group: "reviews" },
  { key: "guest_checkout", value: "true", type: "boolean", group: "checkout" },
  { key: "maintenance_mode", value: "false", type: "boolean", group: "system" },
  { key: "seo_title", value: "LuxeShop — Premium Products, Delivered", type: "string", group: "seo" },
  { key: "seo_description", value: "Shop premium curated products with fast delivery and easy returns.", type: "string", group: "seo" },
  { key: "announcement_bar_text", value: "Free shipping on orders over ₹999! 🎉", type: "string", group: "content" },
  { key: "announcement_bar_enabled", value: "true", type: "boolean", group: "content" },
];

async function main() {
  console.log("🌱 Starting seed...\n");

  // ---- 1. Create Permissions ----
  console.log("📝 Creating permissions...");
  const permissionMap: Record<string, string> = {};

  for (const permission of ALL_PERMISSIONS) {
    const p = await prisma.permission.upsert({
      where: { name: permission.name },
      update: { displayName: permission.displayName },
      create: permission,
    });
    permissionMap[p.name] = p.id;
  }
  console.log(`   ✓ ${ALL_PERMISSIONS.length} permissions`);

  // ---- 2. Create Roles ----
  console.log("🔐 Creating roles...");
  const roleMap: Record<string, string> = {};

  for (const role of ROLES) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: { displayName: role.displayName },
      create: role,
    });
    roleMap[r.name] = r.id;
  }
  console.log(`   ✓ ${ROLES.length} roles`);

  // ---- 3. Assign Permissions to Roles ----
  console.log("🔗 Assigning permissions to roles...");

  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap[roleName];
    if (!roleId) continue;

    for (const permName of permissions) {
      const permId = permissionMap[permName];
      if (!permId) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: permId } },
        update: {},
        create: { roleId, permissionId: permId },
      });
    }
  }
  console.log("   ✓ Permissions assigned");

  // ---- 4. Create Super Admin User ----
  console.log("👤 Creating super admin user...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@luxeshop.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      emailVerified: new Date(),
      status: "ACTIVE",
      isAdmin: true,
    },
  });

  // Assign SUPER_ADMIN role
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: roleMap["SUPER_ADMIN"] } },
    update: {},
    create: { userId: adminUser.id, roleId: roleMap["SUPER_ADMIN"] },
  });

  console.log(`   ✓ Admin: ${adminEmail} / ${adminPassword}`);

  // ---- 5. Create Site Settings ----
  console.log("⚙️  Creating site settings...");

  for (const setting of DEFAULT_SETTINGS) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`   ✓ ${DEFAULT_SETTINGS.length} settings`);

  // ---- 6. Create Shipping Zone (India Default) ----
  console.log("🚚 Creating default shipping zone...");

  const shippingZone = await prisma.shippingZone.upsert({
    where: { id: "zone-india" },
    update: {},
    create: {
      id: "zone-india",
      name: "India",
      countries: ["IN"],
      states: [],
      postalCodes: [],
      isActive: true,
    },
  });

  const standardMethod = await prisma.shippingMethod.upsert({
    where: { id: "method-standard" },
    update: {},
    create: {
      id: "method-standard",
      zoneId: shippingZone.id,
      name: "Standard Shipping",
      description: "Delivered in 5-7 business days",
      estimatedDays: "5-7 business days",
      isActive: true,
      sortOrder: 0,
    },
  });

  const expressMethod = await prisma.shippingMethod.upsert({
    where: { id: "method-express" },
    update: {},
    create: {
      id: "method-express",
      zoneId: shippingZone.id,
      name: "Express Shipping",
      description: "Delivered in 2-3 business days",
      estimatedDays: "2-3 business days",
      isActive: true,
      sortOrder: 1,
    },
  });

  // Shipping rates
  await prisma.shippingRate.upsert({
    where: { id: "rate-standard" },
    update: {},
    create: {
      id: "rate-standard",
      methodId: standardMethod.id,
      name: "Standard Rate",
      rateType: "flat",
      amount: 4900, // ₹49
      freeShippingThreshold: 99900, // Free over ₹999
    },
  });

  await prisma.shippingRate.upsert({
    where: { id: "rate-express" },
    update: {},
    create: {
      id: "rate-express",
      methodId: expressMethod.id,
      name: "Express Rate",
      rateType: "flat",
      amount: 9900, // ₹99
      freeShippingThreshold: 199900, // Free over ₹1999
    },
  });

  console.log("   ✓ Shipping zones and methods created");

  // ---- 7. DEV ONLY: Sample Categories ----
  if (process.env.NODE_ENV !== "production") {
    console.log("\n🛍️  [DEV ONLY] Creating sample categories...");

    const categories = [
      { id: "cat-electronics", name: "Electronics", slug: "electronics" },
      { id: "cat-fashion", name: "Fashion", slug: "fashion" },
      { id: "cat-home", name: "Home & Living", slug: "home-living" },
      { id: "cat-beauty", name: "Beauty & Care", slug: "beauty-care" },
      { id: "cat-sports", name: "Sports & Fitness", slug: "sports-fitness" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: {},
        create: { ...cat, isVisible: true },
      });
    }
    console.log(`   ✓ ${categories.length} categories`);

    // ---- 8. DEV ONLY: Sample Products ----
    console.log("📦 [DEV ONLY] Creating sample products...");

    const products = [
      {
        id: "prod-wireless-earbuds",
        name: "Premium Wireless Earbuds",
        slug: "premium-wireless-earbuds",
        sku: "WE-001",
        shortDescription: "True wireless sound with 30-hour battery life",
        description: "Experience crystal-clear audio with our premium wireless earbuds. Featuring active noise cancellation, 30-hour battery life, and IPX5 water resistance. Perfect for music lovers and professionals alike.",
        brand: "SoundMax",
        basePrice: 299900,      // ₹2,999
        compareAtPrice: 499900, // ₹4,999
        costPrice: 120000,      // ₹1,200
        status: "ACTIVE" as const,
        isVisible: true,
        isFeatured: true,
        isNewArrival: true,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        catId: "cat-electronics",
      },
      {
        id: "prod-running-shoes",
        name: "ProFit Running Shoes",
        slug: "profit-running-shoes",
        sku: "RS-001",
        shortDescription: "Lightweight performance shoes for serious runners",
        description: "Engineered for performance with responsive cushioning and breathable mesh upper. Whether you're training for a marathon or a morning jog, ProFit has you covered.",
        brand: "ProFit",
        basePrice: 399900,      // ₹3,999
        compareAtPrice: 599900, // ₹5,999
        costPrice: 180000,      // ₹1,800
        status: "ACTIVE" as const,
        isVisible: true,
        isBestseller: true,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        catId: "cat-sports",
      },
      {
        id: "prod-leather-wallet",
        name: "Genuine Leather Wallet",
        slug: "genuine-leather-wallet",
        sku: "LW-001",
        shortDescription: "Slim, elegant, RFID-blocking genuine leather wallet",
        description: "Handcrafted from top-grain leather with RFID-blocking technology. Ultra-slim design fits perfectly in your pocket without the bulk.",
        brand: "LuxeLeather",
        basePrice: 159900,      // ₹1,599
        compareAtPrice: 249900, // ₹2,499
        costPrice: 60000,       // ₹600
        status: "ACTIVE" as const,
        isVisible: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
        catId: "cat-fashion",
      },
      {
        id: "prod-smart-watch",
        name: "Minimalist Chrono Smartwatch",
        slug: "minimalist-chrono-smartwatch",
        sku: "SW-001",
        shortDescription: "AMOLED Display, 7-day battery, Heart & Sleep Tracking",
        description: "Sleek aerospace-grade aluminum casing with an ultra-bright AMOLED display. Monitors heart rate, oxygen levels, workouts, and notifications in real-time.",
        brand: "ChronoTech",
        basePrice: 699900,      // ₹6,999
        compareAtPrice: 999900, // ₹9,999
        costPrice: 320000,      // ₹3,200
        status: "ACTIVE" as const,
        isVisible: true,
        isFeatured: true,
        isBestseller: true,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        catId: "cat-electronics",
      },
    ];

    for (const prod of products) {
      const { catId, imageUrl, ...productData } = prod;

      await prisma.product.upsert({
        where: { id: productData.id },
        update: {},
        create: {
          ...productData,
          publishedAt: new Date(),
          categories: {
            create: {
              categoryId: catId,
            },
          },
          images: {
            create: {
              url: imageUrl,
              isPrimary: true,
              position: 0,
            },
          },
          variants: {
            create: {
              sku: `${productData.sku}-DEFAULT`,
              options: {},
              price: productData.basePrice,
              compareAtPrice: productData.compareAtPrice,
              costPrice: productData.costPrice,
              stock: 100,
              status: "ACTIVE",
            },
          },
        },
      });
    }
    console.log(`   ✓ ${products.length} sample products`);
  }

  // ---- 9. Homepage Sections ----
  console.log("🏠 Creating homepage sections...");

  const homeSections = [
    {
      id: "section-hero",
      type: "HERO" as const,
      title: "Premium Products, Delivered",
      subtitle: "Discover our curated collection of high-quality products",
      content: {
        ctaText: "Shop Now",
        ctaLink: "/shop",
        image: null,
        backgroundColor: "#0f0f0f",
      },
      isEnabled: true,
      sortOrder: 0,
    },
    {
      id: "section-featured-cats",
      type: "FEATURED_CATEGORIES" as const,
      title: "Shop by Category",
      isEnabled: true,
      sortOrder: 1,
    },
    {
      id: "section-featured-products",
      type: "FEATURED_PRODUCTS" as const,
      title: "Featured Products",
      isEnabled: true,
      sortOrder: 2,
    },
    {
      id: "section-best-sellers",
      type: "BEST_SELLERS" as const,
      title: "Best Sellers",
      isEnabled: true,
      sortOrder: 3,
    },
    {
      id: "section-new-arrivals",
      type: "NEW_ARRIVALS" as const,
      title: "New Arrivals",
      isEnabled: true,
      sortOrder: 4,
    },
    {
      id: "section-trust",
      type: "TRUST_BENEFITS" as const,
      title: "Why Shop With Us",
      content: {
        benefits: [
          { icon: "Truck", title: "Free Shipping", description: "On orders over ₹999" },
          { icon: "Shield", title: "Secure Payment", description: "100% secure transactions" },
          { icon: "RefreshCw", title: "Easy Returns", description: "30-day hassle-free returns" },
          { icon: "HeadphonesIcon", title: "24/7 Support", description: "Always here to help" },
        ],
      },
      isEnabled: true,
      sortOrder: 5,
    },
    {
      id: "section-newsletter",
      type: "NEWSLETTER" as const,
      title: "Join Our Newsletter",
      subtitle: "Get exclusive deals and new arrivals directly in your inbox",
      isEnabled: true,
      sortOrder: 6,
    },
  ];

  for (const section of homeSections) {
    await prisma.homepageSection.upsert({
      where: { id: section.id },
      update: {},
      create: section as Parameters<typeof prisma.homepageSection.create>[0]["data"],
    });
  }
  console.log(`   ✓ ${homeSections.length} homepage sections`);

  console.log("\n✅ Seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Admin login: ${adminEmail}`);
  console.log(`Password:    ${process.env.NODE_ENV !== "production" ? process.env.ADMIN_PASSWORD ?? "Admin@123456" : "[set ADMIN_PASSWORD env var]"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
