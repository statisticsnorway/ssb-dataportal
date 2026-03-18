'use client';

import { AppErrorState } from '@/components/app-state';

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const isTestError = error.message === 'E2E test error';
  return (
    <AppErrorState
      title='Beklager, noe gikk galt'
      message='Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.'
      referenceCode={isTestError ? 'E2E_TEST_ERROR' : error.digest}
      onRetry={reset}
      homeHref='/'
    />
  );
}
