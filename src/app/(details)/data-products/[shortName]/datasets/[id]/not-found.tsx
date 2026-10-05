'use client';

import { useParams } from 'next/navigation';
import { buildUrlDataProducts } from '@/app/(details)/data-products/[shortName]/utils/urls';
import { AppNotFoundState } from '@/components/app-state';
import { localization } from '@/libs/language';
export default function NotFound() {
  const { shortName } = useParams<{ shortName: string }>();

  return (
    <AppNotFoundState
      title={localization.error.notFoundTitleDataset}
      message={localization.error.notFoundMessageDataset}
      helpList={localization.error.notFoundHelpListDataset}
      homeHref={buildUrlDataProducts({
        dataProductShortName: shortName,
      })}
      homeLabel={localization.dataProductDetail.dataset}
      secondaryHref={buildUrlDataProducts({})}
      secondaryLabel={localization.dataProduct.labelPlural}
      showBrokenLinkButton={false}
    />
  );
}
