import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';

export default async function VersionVariantPage({
  params,
}: {
  params: Promise<{ id: string; versionNumber: string; variantId: string }>;
}) {
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
      backHref={`/classifications/${classificationId}/version/${versionId}/variants`}
    />
  );
}
