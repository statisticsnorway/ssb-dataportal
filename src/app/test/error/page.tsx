import { headers } from 'next/headers';
import { AppNotFoundState } from '@/components/app-state';

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
export default async function Page() {
  const isEnabled = process.env.ENABLE_TEST_ROUTES === 'true';
  if (!isEnabled) {
    return <AppNotFoundState />; // TODO: Can be notFound() and without assignment (if(process...)
  }
  await headers();
  throw new Error('E2E_TEST_ERROR');
}
