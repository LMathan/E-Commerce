/**
 * Razorpay Payment Gateway Adapter
 *
 * Implements the PaymentGateway interface for Razorpay.
 * Server-side only — never import in client components.
 *
 * Required environment variables:
 * - RAZORPAY_KEY_ID
 * - RAZORPAY_KEY_SECRET
 * - RAZORPAY_WEBHOOK_SECRET
 */

import Razorpay from "razorpay";
import crypto from "crypto";
import type {
  PaymentGateway,
  CreateOrderParams,
  CreateOrderResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
  RefundParams,
  RefundResult,
  WebhookVerifyParams,
  WebhookEvent,
} from "./gateway.interface";
import { PaymentError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class RazorpayAdapter implements PaymentGateway {
  readonly name = "razorpay";
  private client: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables."
      );
    }

    this.client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    try {
      const order = await this.client.orders.create({
        amount: params.amount,
        currency: params.currency,
        receipt: params.orderId.slice(0, 40), // Razorpay has 40-char limit
        notes: {
          orderId: params.orderId,
          ...(params.notes ?? {}),
        },
      });

      logger.info({ orderId: params.orderId, gatewayOrderId: order.id }, "Razorpay order created");

      return {
        gatewayOrderId: order.id,
        amount: order.amount as number,
        currency: order.currency,
        status: order.status,
      };
    } catch (error) {
      logger.error({ error, orderId: params.orderId }, "Razorpay order creation failed");
      throw new PaymentError("Failed to create payment order. Please try again.");
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const isValid = this.verifySignature(
      params.gatewayOrderId,
      params.gatewayPaymentId,
      params.gatewaySignature
    );

    if (!isValid) {
      logger.warn(
        { gatewayOrderId: params.gatewayOrderId, gatewayPaymentId: params.gatewayPaymentId },
        "Razorpay signature verification failed"
      );
      return {
        isValid: false,
        status: "failed",
        gatewayPaymentId: params.gatewayPaymentId,
      };
    }

    try {
      // Fetch payment details from Razorpay for additional verification
      const payment = await this.client.payments.fetch(params.gatewayPaymentId);

      logger.info(
        { gatewayPaymentId: params.gatewayPaymentId, status: payment.status },
        "Razorpay payment verified"
      );

      return {
        isValid: true,
        status: payment.status === "captured" ? "captured" : "pending",
        gatewayPaymentId: params.gatewayPaymentId,
        amount: payment.amount as number,
        method: payment.method as string,
        fee: payment.fee as number,
        metadata: {
          email: payment.email,
          contact: payment.contact,
          bank: payment.bank,
          wallet: payment.wallet,
        },
      };
    } catch (error) {
      logger.error({ error, gatewayPaymentId: params.gatewayPaymentId }, "Razorpay payment fetch failed");
      // Signature was valid but couldn't fetch payment — return valid but pending
      return {
        isValid: true,
        status: "pending",
        gatewayPaymentId: params.gatewayPaymentId,
      };
    }
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      const refund = await this.client.payments.refund(params.gatewayPaymentId, {
        amount: params.amount,
        notes: params.notes,
      });

      logger.info(
        { gatewayPaymentId: params.gatewayPaymentId, refundId: refund.id, amount: params.amount },
        "Razorpay refund created"
      );

      return {
        gatewayRefundId: refund.id,
        amount: refund.amount as number,
        status: refund.status,
      };
    } catch (error) {
      logger.error({ error, gatewayPaymentId: params.gatewayPaymentId }, "Razorpay refund failed");
      throw new PaymentError("Failed to process refund. Please try again.");
    }
  }

  verifyWebhookSignature(params: WebhookVerifyParams): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("RAZORPAY_WEBHOOK_SECRET not set");
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(params.payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    );
  }

  async parseWebhookEvent(payload: string, signature: string): Promise<WebhookEvent> {
    const isValid = this.verifyWebhookSignature({
      payload,
      signature,
      secret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
    });

    if (!isValid) {
      throw new PaymentError("Invalid webhook signature");
    }

    const data = JSON.parse(payload) as Record<string, unknown>;
    const eventId = `rz_evt_${Date.now()}`;

    return {
      id: (data.account_id as string) ?? eventId,
      type: data.event as string,
      data: data.payload as Record<string, unknown>,
      rawBody: payload,
    };
  }

  private verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return false;

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
      );
    } catch {
      return false;
    }
  }
}

// Singleton to avoid re-instantiation on every request
let razorpayInstance: RazorpayAdapter | null = null;

export function getRazorpayAdapter(): RazorpayAdapter {
  if (!razorpayInstance) {
    razorpayInstance = new RazorpayAdapter();
  }
  return razorpayInstance;
}
