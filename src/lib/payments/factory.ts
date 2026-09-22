/**
 * Payment Gateway Factory
 *
 * Returns the configured gateway adapter.
 * Supports multiple gateways in future without changing business logic.
 */

import type { PaymentGateway } from "./gateway.interface";
import { getRazorpayAdapter } from "./razorpay.adapter";

type SupportedGateway = "razorpay" | "stripe";

/**
 * Get the default payment gateway adapter.
 * Configured via environment variable PAYMENT_GATEWAY (default: razorpay).
 */
export function getPaymentGateway(
  gateway?: SupportedGateway
): PaymentGateway {
  const gw = gateway ?? (process.env.PAYMENT_GATEWAY as SupportedGateway) ?? "razorpay";

  switch (gw) {
    case "razorpay":
      return getRazorpayAdapter();
    case "stripe":
      // Stripe adapter will be implemented in a future phase
      throw new Error("Stripe adapter not yet implemented. Use PAYMENT_GATEWAY=razorpay");
    default:
      throw new Error(`Unknown payment gateway: ${gw}`);
  }
}
