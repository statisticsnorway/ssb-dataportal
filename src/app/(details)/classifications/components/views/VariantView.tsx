import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { formatVariantName, mapVariantDetails } from '@/app/(details)/classifications/utils/variants';
import { DetailsList } from '@/components/details-list';
import { fetchVariantForClassification } from '@/libs/data/classifications/variantsData';
import { localization, SupportedLanguage } from '@/libs/language/src/localization';
import { CodesView } from './CodesView';
import styles from './views.module.css';

interface VariantViewProps {
  classificationId: number;
  variantId: number;
  versionId?: number;
  backHref: string;
  fallbackLanguage?: SupportedLanguage;
}

export default async function VariantView({
  classificationId,
  variantId,
  versionId,
  backHref,
  fallbackLanguage,
}: Readonly<VariantViewProps>) {
  const language = await getRequestLanguage();
  //const classification = await fetchClassificationById(classificationId, language);

  const variant = await fetchVariantForClassification(
    classificationId,
    variantId,
    fallbackLanguage ? fallbackLanguage : language,
    versionId,
  );
  if (!variant?.classificationItems) return notFound();
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
