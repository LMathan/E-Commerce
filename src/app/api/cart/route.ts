import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { cookies } from "next/headers";

const CART_SESSION_COOKIE = "luxeshop_cart_id";

async function getOrCreateCartId(req: NextRequest, session: any) {
  if (session?.user?.id) {
    let userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }
    return userCart.id;
  }

  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(CART_SESSION_COOKIE)?.value;

  if (existingCookie) {
    const existingCart = await prisma.cart.findUnique({
      where: { sessionId: existingCookie },
    });
    if (existingCart) return existingCart.id;
  }

  const newSessionId = crypto.randomUUID();
  const newCart = await prisma.cart.create({
    data: { sessionId: newSessionId },
  });

  cookieStore.set(CART_SESSION_COOKIE, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return newCart.id;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const cartId = await getOrCreateCartId(request, session);

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { position: "asc" }, take: 1 },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: "desc" },
        },
        coupon: true,
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0, count: 0 });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      productSlug: item.product.slug,
      variantTitle: item.variant ? JSON.stringify(item.variant.options) : null,
      unitPrice: item.price,
      quantity: item.quantity,
      image: item.product.images[0]?.url || null,
      subtotal: item.price * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      cartId: cart.id,
      items,
      subtotal,
      count,
      coupon: cart.coupon,
    });
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ items: [], subtotal: 0, count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const cartId = await getOrCreateCartId(request, session);
    const { productId, variantId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let unitPrice = product.basePrice;
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });
      if (variant) unitPrice = variant.price;
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId || null,
          quantity,
          price: unitPrice,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Item added to cart" });
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
