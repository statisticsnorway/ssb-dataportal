import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/components/views/ServerUtils';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { fetchVariantForClassification } from '@/libs/data/classifications/variantsData';
import { SupportedLanguage } from '@/libs/language';

export default async function VersionVariantPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; versionNumber: string; variantId: string }>;
}>) {
  const { id: classificationIdParam, versionNumber, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const versionId = Number(versionNumber);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(versionId) || Number.isNaN(variantIdNumber)) return notFound();

  const language = (await getRequestLanguage()) as SupportedLanguage;
  const variant = await fetchVariantForClassification(classificationId, variantIdNumber, language, versionId);
  if (!variant?.classificationItems) return notFound();

  return (
    <VariantView
      variant={variant}
      classificationId={classificationId}
      versionId={versionId}
      fallbackLanguage={language}
      backHref={buildUrl({ classificationId, versionId, tab: 'variants' })}
    />
  );
}
