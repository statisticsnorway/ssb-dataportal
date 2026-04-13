import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
/**
 * Test route used by Playwright to verify global error handling, and to view the error page.
 *
 * This route intentionally throws the error ("E2E_TEST_ERROR") in test runs and local
 * development to trigger the Next.js error boundary and enable stable assertions.
 *
 * NOTE:
 * The console error seen during tests is expected.
 */
export default async function Page() {
  if (process.env.ENABLE_TEST_ROUTES !== 'true') {
    notFound();
  }
  await headers();
  throw new Error('E2E_TEST_ERROR');
}
