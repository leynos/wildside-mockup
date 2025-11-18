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
  const payload =
    hasContext || hasError ? { ...(context ?? {}), ...(hasError ? { error } : {}) } : undefined;

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
