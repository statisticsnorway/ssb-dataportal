import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';

export default async function VariantPage({
  params,
}: Readonly<{ params: Promise<{ id: string; variantId: string }> }>) {
  const { id: classificationIdParam, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(variantIdNumber)) return notFound();

  return (
    <VariantView
      classificationId={classificationId}
      variantId={variantIdNumber}
      backHref={buildUrl({ classificationId, tab: 'variants' })}
    />
  );
}
