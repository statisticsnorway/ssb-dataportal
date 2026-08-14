import { Alert, Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { formatVariantName, mapVariantDetails } from '@/app/(details)/classifications/utils/variants';
import { DetailsList } from '@/components/details-list';
import { fetchVariantForClassification } from '@/libs/data/classifications/variantsData';
import { localization } from '@/libs/language/src/localization';
import { CodesView } from './CodesView';
import styles from './views.module.css';

interface VariantViewProps {
  classificationId: number;
  variantId: number;
  versionId?: number;
  backHref: string;
}

export default async function VariantView({
  classificationId,
  variantId,
  versionId,
  backHref,
}: Readonly<VariantViewProps>) {
  const variant = await fetchVariantForClassification(
    classificationId,
    variantId,
    await getRequestLanguage(),
    versionId,
  );
  if (!variant?.classificationItems) {
    return (
      <div className={styles.aboutWrapper}>
        <DigdirLink asChild>
          <Link href={backHref}>
            <ArrowLeftIcon aria-hidden='true' />
            {localization.codeTree.back}
          </Link>
        </DigdirLink>
        <Alert role='status' data-color='info'>
          {localization.error.classificationDetailsTabs.notFoundVariants}
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.aboutWrapper}>
      <DigdirLink asChild>
        <Link href={backHref}>
          <ArrowLeftIcon aria-hidden='true' />
          {localization.codeTree.back}
        </Link>
      </DigdirLink>
      <Heading className='secondaryHeading' data-size='md' level={2}>
        {formatVariantName(variant.name)}
      </Heading>
      <DetailsList content={mapVariantDetails(variant)} />
      <Heading className='secondaryHeading' data-size='md' level={2}>
        {localization.classificationDetails.codes}
      </Heading>
      <CodesView version={variant} />
    </div>
  );
}
