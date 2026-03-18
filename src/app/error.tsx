'use client';

import { AppErrorState } from '@/components/app-state';

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const isE2ETest = process.env.NEXT_TEST === 'test';
  const referenceCode = isE2ETest ? 'E2E test error' : error.digest;
  return (
    <AppErrorState
      title='Beklager, noe gikk galt'
      message='Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.'
      referenceCode={referenceCode}
      onRetry={reset}
      homeHref='/'
    />
  );
}
