"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Package, ArrowRight, Home, FileText } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 mb-6 animate-bounce">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">Order Placed Successfully!</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Thank you for your purchase. We have received your order and are processing it for shipment.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Order Reference:</span>
          <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Estimated Delivery:</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">3-5 Business Days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Confirmation Sent To:</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">Your Email</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/account/orders">
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            View My Orders
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
