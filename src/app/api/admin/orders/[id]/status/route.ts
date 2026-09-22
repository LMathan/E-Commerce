import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        paidAt: status === "PAID" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("PUT /api/admin/orders/[id]/status error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
