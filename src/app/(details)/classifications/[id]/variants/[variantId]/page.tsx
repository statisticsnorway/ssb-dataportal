import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { SupportedLanguage } from '@/libs/language/src/localization';
import { getRequestLanguage } from '../../../components/views/ServerUtils';
import { buildUrl } from '../../../utils/urls';

export default async function VariantPage({
  params,
}: Readonly<{ params: Promise<{ id: string; variantId: string }> }>) {
  const { id: classificationIdParam, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(variantIdNumber)) return notFound();

  const language = await getRequestLanguage();
  const classification = await fetchClassificationById(classificationId, language as SupportedLanguage);
  return (
    <VariantView
      classificationId={classificationId}
      variantId={variantIdNumber}
      backHref={buildUrl({ classificationId, tab: 'variants' })}
      fallbackLanguage={classification.fallbackLanguage}
    />
  );
}
