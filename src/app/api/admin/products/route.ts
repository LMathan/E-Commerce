import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      brand,
      shortDescription,
      description,
      basePrice,
      compareAtPrice,
      costPrice,
      categoryId,
      imageUrl,
    } = body;

    if (!name || !basePrice) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true }) + "-" + Math.floor(1000 + Math.random() * 9000);
    const sku = "SKU-" + Math.floor(100000 + Math.random() * 900000);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        brand: brand || null,
        shortDescription: shortDescription || null,
        description: description || null,
        basePrice: Math.round(parseFloat(basePrice) * 100),
        compareAtPrice: compareAtPrice ? Math.round(parseFloat(compareAtPrice) * 100) : null,
        costPrice: costPrice ? Math.round(parseFloat(costPrice) * 100) : null,
        status: "ACTIVE",
        isVisible: true,
        publishedAt: new Date(),
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                isPrimary: true,
                position: 0,
              },
            }
          : undefined,
        categories: categoryId
          ? {
              create: {
                categoryId,
              },
            }
          : undefined,
        variants: {
          create: {
            sku: `${sku}-DEFAULT`,
            options: {},
            price: Math.round(parseFloat(basePrice) * 100),
            compareAtPrice: compareAtPrice ? Math.round(parseFloat(compareAtPrice) * 100) : null,
            costPrice: costPrice ? Math.round(parseFloat(costPrice) * 100) : null,
            stock: 100,
            status: "ACTIVE",
          },
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
