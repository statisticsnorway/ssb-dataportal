'use client';

import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { formatVariantName, mapVariantDetails } from '@/app/(details)/classifications/utils/variants';
import { DetailsList } from '@/components/details-list';
import type { ClassificationVariantResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import { CodesView } from './CodesView';
import styles from './views.module.css';

interface VariantViewProps {
  variant: ClassificationVariantResource;
  classificationId: number;
  versionId?: number;
  backHref: string;
  fallbackLanguage: string;
}

export default function VariantView({
  variant,
  classificationId,
  backHref,
  fallbackLanguage,
}: Readonly<VariantViewProps>) {
  return (
    <div className={styles.aboutWrapper}>
      <DigdirLink asChild>
        <Link href={backHref}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <Heading lang={fallbackLanguage} className='secondaryHeading' data-size='md' level={2}>
        {formatVariantName(variant.name)}
      </Heading>
      <DetailsList content={mapVariantDetails(variant)} fallbackLanguage={fallbackLanguage} />
      <Heading className='secondaryHeading' data-size='md' level={2}>
        {localization.classificationDetails.codes}
      </Heading>
      <CodesView version={variant} classificationId={classificationId} isVariantDownload={true} />
    </div>
  );
}
