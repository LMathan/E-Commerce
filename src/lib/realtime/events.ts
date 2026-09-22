/**
 * Realtime event broadcaster.
 *
 * Broadcasts events to Supabase Realtime channels.
 * These are received by admin dashboard and customer tracking pages.
 *
 * Server-side only.
 */

import { createServerSupabaseClient } from "./supabase";
import { REALTIME_CHANNELS, type RealtimeEvent } from "@/config/constants";
import { logger } from "@/lib/logger";

export interface RealtimeEventPayload {
  type: RealtimeEvent;
  data: Record<string, unknown>;
  timestamp: string;
}

/**
 * Broadcast an event to the admin dashboard channel.
 */
export async function broadcastAdminEvent(
  type: RealtimeEvent,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    logger.debug({ type }, "Realtime not configured — skipping broadcast");
    return;
  }

  try {
    const payload: RealtimeEventPayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    const channel = supabase.channel(REALTIME_CHANNELS.ADMIN_DASHBOARD);
    await channel.send({
      type: "broadcast",
      event: type,
      payload,
    });

    logger.debug({ type, channel: REALTIME_CHANNELS.ADMIN_DASHBOARD }, "Realtime event broadcast");
  } catch (error) {
    // Non-critical — log but don't throw
    logger.error({ error, type }, "Failed to broadcast realtime event");
  }
}

/**
 * Broadcast an order status change to the order-specific channel.
 * Customers subscribe to this channel to get live tracking updates.
 */
export async function broadcastOrderEvent(
  orderId: string,
  type: RealtimeEvent,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return;

  try {
    const payload: RealtimeEventPayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    const channelName = `${REALTIME_CHANNELS.ORDER_PREFIX}${orderId}`;
    const channel = supabase.channel(channelName);
    await channel.send({
      type: "broadcast",
      event: type,
      payload,
    });

    logger.debug({ type, orderId, channel: channelName }, "Order realtime event broadcast");
  } catch (error) {
    logger.error({ error, type, orderId }, "Failed to broadcast order realtime event");
  }
}

/**
 * Broadcast inventory update.
 */
export async function broadcastInventoryEvent(
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return;

  try {
    const payload: RealtimeEventPayload = {
      type: "INVENTORY_UPDATED",
      data,
      timestamp: new Date().toISOString(),
    };

    const channel = supabase.channel(REALTIME_CHANNELS.INVENTORY);
    await channel.send({
      type: "broadcast",
      event: "INVENTORY_UPDATED",
      payload,
    });
  } catch (error) {
    logger.error({ error }, "Failed to broadcast inventory event");
  }
}
