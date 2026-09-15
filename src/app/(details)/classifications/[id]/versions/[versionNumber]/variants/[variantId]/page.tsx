import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

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

  return (
    <VariantView
      classificationId={classificationId}
      variantId={variantIdNumber}
      versionId={versionId}
      backHref={buildUrl({ classificationId, versionId, tab: 'variants' })}
    />
  );
}
