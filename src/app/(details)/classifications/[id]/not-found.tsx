'use client';

import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleClassificationDetails}
      message={localization.error.notFoundMessageClassificationDetails}
      helpList={localization.error.notFoundHelpListClassificationId}
      homeHref={buildUrl({})}
      homeLabel={localization.classification.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
