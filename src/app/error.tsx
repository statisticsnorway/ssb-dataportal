'use client';

import { AppErrorState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}) {
  return (
    <AppErrorState
      title={localization.error.somethingWentWrong}
      message={localization.error.technicalProblemsMessage}
      referenceCode={error.digest}
      onRetry={unstable_retry}
      homeHref='/'
    />
  );
}
