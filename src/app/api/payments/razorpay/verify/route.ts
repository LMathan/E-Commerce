import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { RazorpayAdapter } from "@/lib/payments/razorpay.adapter";

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const adapter = new RazorpayAdapter();
    const result = await adapter.verifyPayment({
      gatewayOrderId: razorpayOrderId,
      gatewayPaymentId: razorpayPaymentId,
      gatewaySignature: razorpaySignature,
    });

    if (!result.isValid) {
      await prisma.payment.updateMany({
        where: { orderId, gatewayOrderId: razorpayOrderId },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status to PAID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await prisma.payment.updateMany({
      where: { orderId, gatewayOrderId: razorpayOrderId },
      data: {
        status: "COMPLETED",
        gatewayPaymentId: razorpayPaymentId,
      },
    });

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
