/**
 * Test route used by Playwright to verify global error handling.
 *
 * This route intentionally throws an error in non-production environments
 * to trigger the Next.js error boundary.
 *
 * NOTE:
 * The console error seen during tests is expected.
 */
export default function Page() {
  // Avoid breaking production builds
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  throw new Error('E2E_TEST_ERROR');
}
