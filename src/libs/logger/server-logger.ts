import 'server-only';

import pino from 'pino';

/**
 * Server-side structured logger using Pino.
 *
 * - Outputs JSON to stdout (compatible with any log aggregator)
 * - Log level is controlled by the LOG_LEVEL environment variable (default: 'info')
 * - Use createLogger(module) to create a child logger with module context
 *
 * Usage:
 *   import { createLogger } from '@/libs/logger/server-logger';
 *   const logger = createLogger('variable-definitions');
 *   logger.info({ count: 42 }, 'Fetched variable definitions');
 */

const rootLogger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
});

/**
 * Creates a child logger with the given module name pre-bound.
 * Every log entry will include a `module` field in the JSON output.
 */
export function createLogger(module: string) {
  return rootLogger.child({ module });
}
