/** @file Application-level logging and error reporting helpers.
 *
 * This module centralises structured logging so that UI components do not call
 * console methods directly. In a real deployment, these helpers would be wired
 * to an observability stack (e.g., Sentry, Datadog, or a custom endpoint).
 */

export type LogContext = Record<string, unknown>;

type LogLevel = "info" | "warn" | "error";

const isTestEnvironment =
  typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test";

const logToConsole = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: unknown,
): void => {
  if (isTestEnvironment) {
    return;
  }

  const payload = {
    ...context,
    error,
  };

  // Centralise console usage so lint rules remain quiet in UI components.
  // eslint-disable-next-line no-console
  console[level](message, payload);
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
