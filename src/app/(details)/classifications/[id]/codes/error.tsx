'use client';

import { AppErrorState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function CodesError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <AppErrorState
      title={localization.error.somethingWentWrong}
      message={localization.error.technicalProblemsMessage}
      referenceCode={error.digest}
      onRetry={reset}
      homeHref='/'
    />
  );
}
