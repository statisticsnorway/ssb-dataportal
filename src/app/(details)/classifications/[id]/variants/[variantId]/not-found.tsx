'use client';

import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';

export default function NotFound() {
  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleVariantDetails}
      message={localization.error.notFoundMessageVariantDetails}
      helpList={localization.error.notFoundHelpListVariantDetails}
      homeHref='/'
      secondaryHref='/classifications'
      secondaryLabel={localization.classification.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
