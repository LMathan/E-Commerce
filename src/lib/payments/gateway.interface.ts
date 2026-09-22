/**
 * Payment Gateway Interface.
 *
 * All payment gateway adapters must implement this interface.
 * This enables swapping between Razorpay, Stripe, or any other
 * gateway without changing business logic.
 */

export interface CreateOrderParams {
  orderId: string;          // Our internal order ID
  amount: number;           // Minor units (e.g., paise)
  currency: string;         // "INR", "USD", etc.
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  gatewayOrderId: string;   // Gateway's own order ID
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentParams {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export interface VerifyPaymentResult {
  isValid: boolean;
  status: "captured" | "failed" | "pending";
  gatewayPaymentId: string;
  amount?: number;
  method?: string;
  fee?: number;
  metadata?: Record<string, unknown>;
}

export interface RefundParams {
  gatewayPaymentId: string;
  amount?: number;         // Minor units. null = full refund
  reason?: string;
  notes?: Record<string, string>;
}

export interface RefundResult {
  gatewayRefundId: string;
  amount: number;
  status: string;
}

export interface WebhookVerifyParams {
  payload: string | Buffer;
  signature: string;
  secret: string;
}

export interface WebhookEvent {
  id: string;
  type: string;             // Gateway-specific event type
  data: Record<string, unknown>;
  rawBody: string;
}

/**
 * The interface every payment gateway adapter must implement.
 */
export interface PaymentGateway {
  readonly name: string;

  /**
   * Create a payment order with the gateway.
   * Must be called server-side only.
   */
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;

  /**
   * Verify a payment after the customer completes it.
   * MUST be server-side only — never trust client-provided data.
   */
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;

  /**
   * Issue a refund for a payment.
   */
  refund(params: RefundParams): Promise<RefundResult>;

  /**
   * Verify the webhook signature to prevent spoofing.
   */
  verifyWebhookSignature(params: WebhookVerifyParams): boolean;

  /**
   * Parse a raw webhook payload into a normalized event.
   */
  parseWebhookEvent(payload: string, signature: string): Promise<WebhookEvent>;
}
