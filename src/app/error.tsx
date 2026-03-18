'use client';

import { AppErrorState } from '@/components/app-state';

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const errorCode = error.digest;
  const message =
    'Vi opplever tekniske problemer og jobber med å løse dem. Dette skyldes ikke noe du gjorde.' +
    (errorCode ? ` Feilkode: ${errorCode}` : '');
  return <AppErrorState title='Beklager, noe gikk galt' message={message} onRetry={reset} homeHref='/' />;
}
