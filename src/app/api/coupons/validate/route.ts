import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code, cartAmount = 0 } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 400 });
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      return NextResponse.json({ error: "Coupon is not active yet" }, { status: 400 });
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.minOrderAmount && cartAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${(coupon.minOrderAmount / 100).toFixed(2)} required for this coupon` },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round((cartAmount * coupon.value) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.type === "FIXED_AMOUNT") {
      discountAmount = coupon.value;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (error: any) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
