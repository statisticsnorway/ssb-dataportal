/**
 * Error sanitization utility for safe logging.
 *
 * Extracts only safe fields from error objects to prevent
 * leaking stack traces, tokens, or internal details into logs.
 */

interface SanitizedError {
  message: string;
  code?: string;
}

/**
 * Extracts only `.message` and `.code` from an error object.
 * Handles Error instances, plain strings, and unknown types.
 */
export function sanitizeError(error: unknown): SanitizedError {
  if (error instanceof Error) {
    const sanitized: SanitizedError = { message: error.message };
    if ('code' in error && typeof (error as Record<string, unknown>).code === 'string') {
      sanitized.code = (error as Record<string, unknown>).code as string;
    }
    return sanitized;
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: String(error) };
}
