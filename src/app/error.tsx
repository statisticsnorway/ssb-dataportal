'use client';

import { AppErrorState } from '@/components/app-state';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}) {
  return (
    <AppErrorState
      title='Beklager, noe gikk galt'
      message='Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.'
      referenceCode={error.digest}
      onRetry={unstable_retry}
      homeHref='/'
    />
  );
}
