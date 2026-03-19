import { headers } from 'next/headers';

/**
 * Test route used by Playwright to verify global error handling, and to view the error page.
 *
 * This route intentionally throws the error ("E2E_TEST_ERROR") in test runs and local
 * development to trigger the Next.js error boundary and enable stable assertions.
 *
 * Outside those environments, the route returns null to avoid exposing test-specific behavior.
 *
 * NOTE:
 * The console error seen during tests is expected.
 */
export default function Page() {
  const isEnabled = process.env.NEXT_TEST === 'test' || process.env.NODE_ENV === 'development';
  if (!isEnabled) {
    return null;
  }
  const _headers = headers();
  void _headers;
  throw new Error('E2E_TEST_ERROR');
}
