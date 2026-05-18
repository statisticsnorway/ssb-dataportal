import 'server-only';
import pino from 'pino';

/**
 * Server-side structured logger using Pino.
 *
 * - Outputs JSON to stdout (compatible with any log aggregator)
 * - Log level is controlled by the LOG_LEVEL environment variable (default: 'info')
 * - In production, outputs GCP Cloud Logging-compatible JSON:
 *     - Uses `severity` instead of `level` for GCP log level filtering
 *     - Uses `message` instead of `msg` for GCP log display
 * - In development, uses pino-pretty for human-readable colorized output
 * - Use createLogger(module) to create a child logger with module context
 *
 * Usage:
 *   import { createLogger } from '@/libs/logger/server-logger';
 *   const logger = createLogger('variable-definitions');
 *   logger.info({ count: 42 }, 'Fetched variable definitions');
 */
const GCP_SEVERITY_MAP: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const isDevelopment = process.env.NODE_ENV === 'development';

const rootLogger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {
        messageKey: 'message',
        formatters: {
          level(label) {
            return { severity: GCP_SEVERITY_MAP[label] ?? 'INFO' };
          },
        },
      }),
});

/**
 * Allow enriching all log messages with key/value pairs
 * @param bindings
 */
export function addGlobalLoggerBindings(bindings: Record<string, unknown>) {
  rootLogger.setBindings(bindings);
}

/**
 * Creates a child logger with the given module name pre-bound.
 * Every log entry will include a `module` field in the JSON output.
 */
export function createLogger(module: string) {
  return rootLogger.child({ module });
}

/**
 * Creates a child logger with the given module name pre-bound.
 * Every log entry will include a `module` field in the JSON output.
 */
export function createLoggerWithBindings(bindings: Record<string, unknown>) {
  return rootLogger.child(bindings);
}
