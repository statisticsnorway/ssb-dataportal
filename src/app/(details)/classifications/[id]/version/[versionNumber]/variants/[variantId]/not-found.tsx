'use client';

import { useParams } from 'next/navigation';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  const { id, versionNumber } = useParams<{ id: string; versionNumber: string }>();

  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleVariantDetails}
      message={localization.error.notFoundMessageVariantDetails}
      helpList={localization.error.notFoundHelpListVariantDetails}
      homeHref='/classifications'
      homeLabel={localization.classification.labelPlural}
      secondaryHref={`/classifications/${id}/version/${versionNumber}/variants`}
      secondaryLabel={localization.classificationDetails.variants}
      showBrokenLinkButton={false}
    />
  );
}
