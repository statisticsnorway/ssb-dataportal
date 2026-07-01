'use client';

import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleClassificationDetails}
      message={localization.error.notFoundMessageClassificationDetails}
      helpList={localization.error.notFoundHelpListClassificationDetails}
      homeHref='/'
      secondaryHref='/classifications'
      secondaryLabel={localization.classification.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
