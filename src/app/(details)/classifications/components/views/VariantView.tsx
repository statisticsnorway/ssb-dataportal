import { Link as DigdirLink, Heading } from '@digdir/designsystemet-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { formatVariantName, mapVariantDetails } from '@/app/(details)/classifications/utils/variants';
import { DetailsList } from '@/components/details-list';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVariantById } from '@/libs/data/classifications/variantsData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { localization } from '@/libs/language/src/localization';
import { resolveDefaultVersion } from '../../utils/versionSelection';
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
  const language = await getRequestLanguage();

  const resolvedVersionId =
    versionId ??
    resolveDefaultVersion((await fetchClassificationById(classificationId, language)).versions ?? [], new Date())?.id;

  if (!resolvedVersionId) {
    return notFound();
  }

  const version = await fetchVersionById(resolvedVersionId, language, true);

  if (!version?.classificationVariants?.some((v) => v.id === variantId)) {
    return notFound();
  }

  const variant = await fetchVariantById(variantId, language);
  if (!variant?.classificationItems) return notFound();

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
      <CodesView version={variant} classificationId={classificationId} isVariantDownload={true} />
    </div>
  );
}
