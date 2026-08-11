import { Heading, Link } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { CodesView } from '@/app/(details)/classifications/components/views/CodesView';
import styles from '@/app/(details)/classifications/components/views/views.module.css';
import { formatVariantName, mapVariantDetails } from '@/app/(details)/classifications/utils/variants';
import { DetailsList } from '@/components/details-list';
import { fetchVariantById } from '@/libs/data/classifications/variantsData';
import { localization } from '@/libs/language/src/localization';

export default async function VariantPage({ params }: { params: Promise<{ id: string; variantId: string }> }) {
  const { id: classificationIdParam, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(variantIdNumber)) return notFound();

  const variant = await fetchVariantById(variantIdNumber, await getRequestLanguage());
  if (!variant?.classificationItems) return notFound();

  return (
    <div className={styles.aboutWrapper}>
      <Link href={`/classifications/${classificationId}/variants`}>{localization.codeTree.back}</Link>
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
