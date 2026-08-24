'use client';

import { useParams } from 'next/navigation';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleVariantDetails}
      message={localization.error.notFoundMessageVariantDetails}
      helpList={localization.error.notFoundHelpListVariantDetails}
      homeHref={buildUrl({})}
      homeLabel={localization.classification.labelPlural}
      secondaryHref={buildUrl({ classificationId: Number(id), tab: 'variants' })}
      secondaryLabel={localization.classificationDetails.variants}
      showBrokenLinkButton={false}
    />
  );
}
