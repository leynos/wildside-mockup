/** @file Application-level logging and error reporting helpers.
 *
 * ⚠️ Compliance note: never log sensitive or personally identifiable
 * information. That includes names, email addresses, user IDs, authentication
 * tokens, payment details, SSNs/NINOs, GPS coordinates, health data, or any
 * field that could identify or track a user. If context requires an identifier,
 * prefer redacted values, salted hashes, or opaque IDs that cannot be reversed
 * into the original secret. When in doubt, omit the field entirely.
 *
 * This module centralises structured logging so that UI components do not call
 * console methods directly. In a real deployment, these helpers would be wired
 * to an observability stack (e.g., Sentry, Datadog, or a custom endpoint).
 */

/**
 * Arbitrary metadata attached to a log entry.
 *
 * ⚠️ Do NOT include sensitive data (names, emails, user IDs, auth tokens,
 * secrets, SSNs, payment info, GPS coordinates, etc.). Always redact or hash
 * such fields before logging.
 */
export type LogContext = Record<string, unknown>;

type LogLevel = "info" | "warn" | "error";

const REPLACEMENT = "[REDACTED]";
const sensitiveKeyPattern =
  /(email|e[-_]?mail|user[-_]?id|auth[-_]?token|token|password|secret|ssn|nino|ssnlike|gps(?:[-_]?lat|[-_]?lon)?|lat|lon|location(?:[-_]?id|[-_]?lat|[-_]?lon)?)/i;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

const sanitiseContext = (context?: LogContext): LogContext | undefined => {
  if (!context) return context;

  const seen = new WeakMap<object, object>();

  const cloneAndSanitise = (value: unknown, key?: string): unknown => {
    if (typeof key === "string" && sensitiveKeyPattern.test(key)) {
      return REPLACEMENT;
    }

    if (Array.isArray(value)) {
      if (seen.has(value)) {
        return seen.get(value) as unknown[];
      }
      const result: unknown[] = [];
      seen.set(value, result);
      value.forEach((item, index) => {
        result[index] = cloneAndSanitise(item);
      });
      return result;
    }

    if (isPlainObject(value)) {
      if (seen.has(value)) {
        return seen.get(value) as object;
      }
      const result: Record<string, unknown> = {};
      seen.set(value, result);
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        result[nestedKey] = cloneAndSanitise(nestedValue, nestedKey);
      });
      return result;
    }

    return value;
  };

  return cloneAndSanitise(context) as LogContext;
};

const isTestEnvironment = typeof process !== "undefined" && process?.env?.NODE_ENV === "test";

const logToConsole = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: unknown,
): void => {
  if (isTestEnvironment) {
    return;
  }

  const hasContext = context && Object.keys(context).length > 0;
  const hasError = typeof error !== "undefined";
  const sanitisedContext = hasContext ? sanitiseContext(context) : undefined;
  const payload =
    sanitisedContext || hasError
      ? { ...(sanitisedContext ?? {}), ...(hasError ? { error } : {}) }
      : undefined;

  // Centralise console usage so lint rules remain quiet in UI components.
  // eslint-disable-next-line no-console
  if (payload) {
    console[level](message, payload);
  } else {
    console[level](message);
  }
};

export const appLogger = {
  info(message: string, context?: LogContext): void {
    logToConsole("info", message, context);
  },
  warn(message: string, context?: LogContext, error?: unknown): void {
    logToConsole("warn", message, context, error);
  },
  error(message: string, context?: LogContext, error?: unknown): void {
    logToConsole("error", message, context, error);
  },
};

export const reportError = (error: unknown, context?: LogContext): void => {
  // In a production app, forward to an external error-reporting service here.
  appLogger.error("Captured application error", context, error);
};
