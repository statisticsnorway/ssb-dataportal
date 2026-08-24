'use client';

import { useParams } from 'next/navigation';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  const { id, versionNumber } = useParams<{ id: string; versionNumber: string }>();

  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleCorrespondenceDetails}
      message={localization.error.notFoundMessageCorrespondenceDetails}
      helpList={localization.error.notFoundHelpListCorrespondenceDetails}
      homeHref={buildUrl({})}
      homeLabel={localization.classification.labelPlural}
      secondaryHref={buildUrl({
        classificationId: Number(id),
        versionId: Number(versionNumber),
        tab: 'correspondences',
      })}
      secondaryLabel={localization.classificationDetails.correspondences}
      showBrokenLinkButton={false}
    />
  );
}
