import { notFound } from 'next/navigation';
import VariantView from '@/app/(details)/classifications/components/views/VariantView';

export default async function VariantPage({ params }: { params: Promise<{ id: string; variantId: string }> }) {
  const { id: classificationIdParam, variantId } = await params;
  const classificationId = Number(classificationIdParam);
  const variantIdNumber = Number(variantId);
  if (Number.isNaN(classificationId) || Number.isNaN(variantIdNumber)) return notFound();

  return <VariantView variantId={variantIdNumber} backHref={`/classifications/${classificationId}/variants`} />;
}
