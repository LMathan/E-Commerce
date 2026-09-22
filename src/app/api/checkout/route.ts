import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { RazorpayAdapter } from "@/lib/payments/razorpay.adapter";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      cartId,
      shippingAddress,
      shippingMethodId = "method-standard",
      paymentMethod = "RAZORPAY",
      couponCode,
    } = body;

    if (!cartId || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing cart or shipping details" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // 1. Calculate items subtotal
    let subtotal = 0;
    const orderItemsData = cart.items.map((item) => {
      const unitPrice = item.variant ? item.variant.price : item.product.basePrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.product.name,
        sku: item.variant ? item.variant.sku : (item.product.sku || "N/A"),
        unitPrice,
        quantity: item.quantity,
        totalPrice,
      };
    });

    // 2. Shipping calculation
    const shippingAmount = shippingMethodId === "method-express" ? 9900 : 4900;

    // 3. Discount calculation
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive) {
        couponId = coupon.id;
        if (coupon.type === "PERCENTAGE") {
          discountAmount = Math.round((subtotal * coupon.value) / 100);
        } else if (coupon.type === "FIXED_AMOUNT") {
          discountAmount = coupon.value;
        }
      }
    }

    // Tax (18% default GST)
    const taxAmount = Math.round((subtotal - discountAmount) * 0.18);
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

    // Generate readable order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Save Shipping Address
    const address = await prisma.address.create({
      data: {
        userId: session?.user?.id || null,
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "IN",
        phone: shippingAddress.phone,
        label: "Shipping",
      },
    });

    // 5. Create Order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        guestEmail: !session?.user?.id ? shippingAddress.email : null,
        guestPhone: !session?.user?.id ? shippingAddress.phone : null,
        status: paymentMethod === "COD" ? "PAID" : "PENDING_PAYMENT",
        currency: "INR",
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        couponId,
        couponCode,
        shippingAddressId: address.id,
        billingAddressId: address.id,
        shippingMethodId,
        items: {
          create: orderItemsData,
        },
      },
    });

    // 6. Clear Cart
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // 7. If Razorpay, initialize gateway payment order
    let razorpayOrderData = null;
    if (paymentMethod === "RAZORPAY") {
      try {
        const gateway = new RazorpayAdapter();
        const razorpayOrder = await gateway.createOrder({
          amount: totalAmount,
          currency: "INR",
          orderId: order.id,
          notes: {
            orderNumber: order.orderNumber,
            customerEmail: shippingAddress.email,
          },
        });

        // Save payment record
        await prisma.payment.create({
          data: {
            orderId: order.id,
            gateway: "RAZORPAY",
            gatewayOrderId: razorpayOrder.gatewayOrderId,
            amount: totalAmount,
            currency: "INR",
            status: "PENDING",
            idempotencyKey: `pay_${order.id}_${Date.now()}`,
            gatewayResponse: razorpayOrder as any,
          },
        });

        razorpayOrderData = {
          orderId: razorpayOrder.gatewayOrderId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        };
      } catch (gatewayErr: any) {
        console.warn("Razorpay initialization warning (sandbox mode active):", gatewayErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paymentMethod,
      razorpayOrder: razorpayOrderData,
    });
  } catch (error: any) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { error: "Checkout process failed: " + error.message },
      { status: 500 }
    );
  }
}
