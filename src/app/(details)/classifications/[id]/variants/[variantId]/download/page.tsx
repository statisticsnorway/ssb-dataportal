import { notFound } from 'next/navigation';
import { DownloadVariantCodesRouteDialog } from '@/app/(details)/classifications/components/download-dialog/route-dialogs';

export default async function VariantDownloadPage({ params }: Readonly<{ params: Promise<{ variantId: string }> }>) {
  const { variantId } = await params;
  const parsedVariantId = Number(variantId);

  if (!Number.isInteger(parsedVariantId)) {
    return notFound();
  }

  return <DownloadVariantCodesRouteDialog variantId={parsedVariantId} />;
}
