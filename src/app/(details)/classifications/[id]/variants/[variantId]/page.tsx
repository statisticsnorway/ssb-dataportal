import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { getRequestLanguage } from '@/libs/data/classifications/utils';
import { fetchVariantForClassification } from '@/libs/data/classifications/variantsData';
import { SupportedLanguage } from '@/libs/language/src/localization';

export default async function VariantPage({
  params,
}: Readonly<{ params: Promise<{ id: string; variantId: string }> }>) {
  const { id: classificationIdParam, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(variantIdNumber)) return notFound();

  const language = (await getRequestLanguage()) as SupportedLanguage;
  const variant = await fetchVariantForClassification(classificationId, variantIdNumber, language);
  if (!variant?.classificationItems) return notFound();

  return (
    <VariantView
      variant={variant}
      classificationId={classificationId}
      fallbackLanguage={language}
      backHref={buildUrl({ classificationId, tab: 'variants' })}
    />
  );
}
