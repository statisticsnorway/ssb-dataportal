/**
 * Client-side logger — dev-only, no-op in production.
 *
 * Mirrors the server logger API so call sites look the same,
 * but never outputs anything in production builds.
 *
 * Usage:
 *   import { clientLogger } from '@/libs/logger/client-logger';
 *   clientLogger.warn({ error: sanitizeError(err) }, 'Something went wrong');
 */

const isDev = process.env.NODE_ENV === 'development';

// biome-ignore lint/suspicious/noExplicitAny: logger accepts arbitrary structured data
type LogFn = (objOrMsg?: any, msg?: string) => void;

// biome-ignore lint/suspicious/noEmptyBlockStatements: intentional no-op for production
function noop() {}

function makeLogFn(consoleFn: (...args: unknown[]) => void): LogFn {
  if (!isDev) return noop;
  return (objOrMsg, msg) => {
    if (msg !== undefined) {
      consoleFn(msg, objOrMsg);
    } else {
      consoleFn(objOrMsg);
    }
  };
}

/* biome-ignore lint/suspicious/noConsole: logger wrapper — console usage is intentional */
const _debug = console.debug;
/* biome-ignore lint/suspicious/noConsole: logger wrapper */
const _info = console.info;
/* biome-ignore lint/suspicious/noConsole: logger wrapper */
const _warn = console.warn;
/* biome-ignore lint/suspicious/noConsole: logger wrapper */
const _error = console.error;

export const clientLogger = {
  debug: makeLogFn(_debug),
  info: makeLogFn(_info),
  warn: makeLogFn(_warn),
  error: makeLogFn(_error),
};
