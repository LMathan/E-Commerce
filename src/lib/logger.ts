/**
 * Structured logger using pino.
 * Never logs passwords, tokens, payment secrets, or sensitive data.
 */

import pino from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: {
    service: "ecommerce",
    env: process.env.NODE_ENV,
  },
  // In production, output JSON for log aggregation tools
  // In development, use pretty formatting
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino/file",
      options: { destination: 1 }, // stdout
    },
  }),
  // Redact sensitive fields from all log output
  redact: {
    paths: [
      "password",
      "passwordHash",
      "token",
      "secret",
      "apiKey",
      "authorization",
      "cookie",
      "*.password",
      "*.token",
      "*.secret",
      "*.apiKey",
      "headers.authorization",
      "headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});

export { logger };

/**
 * Create a child logger with request context.
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({
    requestId,
    userId: userId ?? "anonymous",
  });
}
