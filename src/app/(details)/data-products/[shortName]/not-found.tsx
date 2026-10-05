'use client';

import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';
import { buildUrlDataProducts } from './utils/urls';

export default function NotFound() {
  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleDataProductDetails}
      message={localization.error.notFoundMessageDataProductDetails}
      helpList={localization.error.notFoundHelpListDataProductDetails}
      homeHref={buildUrlDataProducts({})}
      homeLabel={localization.dataProduct.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
