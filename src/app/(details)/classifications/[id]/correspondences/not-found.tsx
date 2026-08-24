'use client';

import { useParams } from 'next/navigation';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';
import { buildUrl } from '../../utils/urls';

export default function NotFound() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleCorrespondenceDetails}
      message={localization.error.notFoundMessageCorrespondenceDetails}
      helpList={localization.error.notFoundHelpListCorrespondenceDetails}
      homeHref={buildUrl({})}
      homeLabel={localization.classification.labelPlural}
      secondaryHref={buildUrl({ classificationId: Number(id), tab: 'correspondences' })}
      secondaryLabel={localization.classificationDetails.correspondences}
      showBrokenLinkButton={false}
    />
  );
}
