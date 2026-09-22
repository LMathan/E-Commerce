/**
 * Application error classes.
 * Use these instead of generic Error to enable structured error handling.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string[]>;

  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
    this.fields = fields;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 402, "PAYMENT_ERROR");
  }
}

export class StockError extends AppError {
  constructor(message: string = "Insufficient stock") {
    super(message, 409, "INSUFFICIENT_STOCK");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

/**
 * Standard API response format.
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a success API response.
 */
export function successResponse<T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> {
  return { success: true, data, ...(message && { message }) };
}

/**
 * Create an error API response from an AppError or unknown error.
 */
export function errorResponse(error: unknown): ApiErrorResponse {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        fields: error.fields,
      },
    };
  }

  if (error instanceof AppError && error.isOperational) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  // Unknown/unexpected error — don't leak details in production
  const isProd = process.env.NODE_ENV === "production";
  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProd ? "Something went wrong. Please try again." : String(error),
    },
  };
}

/**
 * Get HTTP status code from an error.
 */
export function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}
