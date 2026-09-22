import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        videos: true,
        variants: {
          orderBy: { createdAt: "asc" },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!product || product.status !== "ACTIVE" || !product.isVisible) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch related products in same category
    const categoryIds = product.categories.map((c) => c.categoryId);
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        status: "ACTIVE",
        isVisible: true,
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      },
      take: 4,
      include: {
        images: { take: 1 },
      },
    });

    const totalReviews = product.reviews.length;
    const avgRating = totalReviews > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 5.0;

    return NextResponse.json({
      product: {
        ...product,
        avgRating,
        totalReviews,
      },
      relatedProducts,
    });
  } catch (error: any) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
