/**
 * Test route used by Playwright to verify global error handling, and to view the error page.
 *
 * This route intentionally throws the error ("E2E_TEST_ERROR") in test runs
 * to trigger the Next.js error boundary and enable stable assertions.
 *
 * NOTE:
 * The console error seen during tests is expected.
 */
export default function Page() {
  // Avoid breaking production builds
  if (process.env.NEXT_TEST !== 'test' && process.env.NODE_ENV !== 'development') {
    return null;
  }
  throw new Error('E2E_TEST_ERROR');
}
