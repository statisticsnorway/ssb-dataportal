'use client';

import { AppErrorState } from '@/components/app-state';

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <AppErrorState
      title='Beklager, noe gikk galt'
      message='Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.'
      referenceCode={error.digest}
      onRetry={reset}
      homeHref='/'
    />
  );
}
