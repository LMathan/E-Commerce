import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brand = searchParams.get("brand") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";

    const where: any = {
      status: "ACTIVE",
      isVisible: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    if (brand) {
      where.brand = { equals: brand, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Math.round(parseFloat(minPrice) * 100);
      if (maxPrice) where.basePrice.lte = Math.round(parseFloat(maxPrice) * 100);
    }

    if (featured) where.isFeatured = true;
    if (bestseller) where.isBestseller = true;

    // Sorting logic
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { basePrice: "asc" };
    else if (sort === "price_desc") orderBy = { basePrice: "desc" };
    else if (sort === "name_asc") orderBy = { name: "asc" };
    else if (sort === "popular") orderBy = { isBestseller: "desc" };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { position: "asc" },
            take: 2,
          },
          categories: {
            include: {
              category: true,
            },
          },
          variants: {
            take: 5,
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Format products with rating averages
    const formattedProducts = products.map((p) => {
      const totalReviews = p.reviews.length;
      const avgRating = totalReviews > 0
        ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 5.0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        isOnSale: p.isOnSale,
        images: p.images,
        primaryImage: p.images[0]?.url || null,
        categories: p.categories.map((c) => c.category),
        avgRating,
        totalReviews,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
