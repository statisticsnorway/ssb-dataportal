import { Heading, Tag } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDataProductByShortName } from '@/libs/data/datasets/datasets';

export async function generateMetadata({ params }: { params: Promise<{ shortName: string }> }): Promise<Metadata> {
  const { shortName } = await params;
  const dataProduct = await getDataProductByShortName(shortName).catch(() => null);
  return { title: dataProduct?.title ?? shortName };
}

export default async function DataProductDetail({ params }: { params: Promise<{ shortName: string }> }) {
  const { shortName } = await params;
  const dataProduct = await getDataProductByShortName(shortName).catch(() => null);

  if (!dataProduct) return notFound();

  return (
    <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <Tag data-color='success' data-size='md' style={{ marginBottom: '0.5rem' }}>
        {dataProduct.product_short_name}
      </Tag>
      <Heading level={1}>{dataProduct.title}</Heading>
    </main>
  );
}
